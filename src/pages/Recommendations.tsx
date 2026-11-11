import { useState } from 'react'
import { askForRecommendation, fetchCoinMarketData } from '../api'
import { useAppSelector } from '../store/store'
import type { Recommendation } from '../types'

export default function Recommendations() {
  const selected = useAppSelector((state) => state.coins.selected)
  const [apiKey, setApiKey] = useState(sessionStorage.getItem('openaiKey') ?? '')
  const [coinId, setCoinId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Recommendation | null>(null)

  function handleCoinChange(id: string) {
    setCoinId(id)
    setResult(null)
    setError('')
  }

  async function handleRecommend() {
    sessionStorage.setItem('openaiKey', apiKey)
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const coinData = await fetchCoinMarketData(coinId)
      setResult(await askForRecommendation(apiKey, coinData))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
    setLoading(false)
  }

  if (selected.length === 0) {
    return <p className="message">No coins selected. Choose coins with the switch on the Home page.</p>
  }

  return (
    <section className="page">
      <h2>AI Recommendation</h2>

      <label className="api-key">
        OpenAI API key:
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
      </label>

      {selected.map((coin) => (
        <label key={coin.id} className="coin-option">
          <input
            type="radio"
            name="coin"
            checked={coinId === coin.id}
            onChange={() => handleCoinChange(coin.id)}
          />
          <img src={coin.image} alt="" width={24} height={24} />
          {coin.name} ({coin.symbol.toUpperCase()})
        </label>
      ))}

      <button className="info-btn" disabled={!coinId || !apiKey || loading} onClick={handleRecommend}>
        {loading ? 'Loading...' : 'Get Recommendation'}
      </button>

      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <h3>{result.recommendation === 'buy' ? 'Worth buying' : 'Not worth buying'}</h3>
          <p>{result.explanation}</p>
        </div>
      )}
    </section>
  )
}
