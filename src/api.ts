import type { Coin, CoinMarketData, Recommendation } from './types'

const COINGECKO_URL = 'https://api.coingecko.com/api/v3'
const BINANCE_URL = 'https://data-api.binance.vision/api/v3'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }
  return response.json()
}

export async function fetchCoinsList(): Promise<Coin[]> {
  const data = await getJson<Coin[]>(`${COINGECKO_URL}/coins/markets?vs_currency=usd`)
  return data.map(({ id, symbol, name, image }) => ({ id, symbol, name, image }))
}

type ByCurrency = Record<string, number>

interface CoinDetails {
  name: string
  market_data: {
    current_price: ByCurrency
    market_cap: ByCurrency
    total_volume: ByCurrency
    price_change_percentage_30d_in_currency: ByCurrency
    price_change_percentage_60d_in_currency: ByCurrency
    price_change_percentage_200d_in_currency: ByCurrency
  }
}

export async function fetchCoinPrices(id: string) {
  const data = await getJson<CoinDetails>(`${COINGECKO_URL}/coins/${id}`)
  const { usd, eur, ils } = data.market_data.current_price
  return { usd, eur, ils }
}

// One request returns all prices. Returns e.g. { BTC: 90000, ETH: 3000 } (USDT pairs, ~USD).
// Coins that Binance doesn't trade against USDT are simply missing from the result.
export async function fetchLivePrices(symbols: string[]) {
  const all = await getJson<{ symbol: string; price: string }[]>(`${BINANCE_URL}/ticker/price`)
  const prices: Record<string, number> = {}
  for (const symbol of symbols) {
    const ticker = all.find((t) => t.symbol === `${symbol}USDT`)
    if (ticker) prices[symbol] = Number(ticker.price)
  }
  return prices
}

export async function fetchCoinMarketData(id: string): Promise<CoinMarketData> {
  const data = await getJson<CoinDetails>(`${COINGECKO_URL}/coins/${id}?market_data=true`)
  const market = data.market_data
  return {
    name: data.name,
    current_price_usd: market.current_price.usd,
    market_cap_usd: market.market_cap.usd,
    volume_24h_usd: market.total_volume.usd,
    price_change_percentage_30d_in_currency: market.price_change_percentage_30d_in_currency.usd,
    price_change_percentage_60d_in_currency: market.price_change_percentage_60d_in_currency.usd,
    price_change_percentage_200d_in_currency: market.price_change_percentage_200d_in_currency.usd,
  }
}

export async function askForRecommendation(
  apiKey: string,
  coinData: CoinMarketData,
): Promise<Recommendation> {
  const prompt =
    'You are a crypto analyst. Based on the following data, should I buy this coin? ' +
    'Answer only with JSON in this format: ' +
    '{"recommendation": "buy" or "dont buy", "explanation": "a short paragraph explaining why"}.\n' +
    JSON.stringify(coinData)

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!response.ok) {
    throw new Error(`ChatGPT request failed (${response.status})`)
  }
  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}
