export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
}

export interface CoinPrices {
  usd: number
  eur: number
  ils: number
  time: number
}

export interface CoinMarketData {
  name: string
  current_price_usd: number
  market_cap_usd: number
  volume_24h_usd: number
  price_change_percentage_30d_in_currency: number
  price_change_percentage_60d_in_currency: number
  price_change_percentage_200d_in_currency: number
}

export interface Recommendation {
  recommendation: 'buy' | 'dont buy'
  explanation: string
}
