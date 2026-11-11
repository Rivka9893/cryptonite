import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchLivePrices } from '../api'
import { useAppSelector } from '../store/store'

type Point = { time: string; [symbol: string]: number | string }

const COLORS = ['#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4']
const MAX_POINTS = 30

export default function Reports() {
  const selected = useAppSelector((state) => state.coins.selected)
  const [history, setHistory] = useState<Point[]>([])
  const [error, setError] = useState('')

  const symbols = selected.map((coin) => coin.symbol.toUpperCase())
  const symbolsKey = symbols.join(',')

  useEffect(() => {
    setHistory([])
    if (!symbolsKey) return

    async function update() {
      try {
        const data = await fetchLivePrices(symbolsKey.split(','))
        const point: Point = { time: new Date().toLocaleTimeString() }
        for (const symbol of symbolsKey.split(',')) {
          if (data[symbol]) point[symbol] = data[symbol]
        }
        setHistory((old) => [...old, point].slice(-MAX_POINTS))
        setError('')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load prices')
      }
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [symbolsKey])

  if (selected.length === 0) {
    return <p className="message">No coins selected. Choose coins with the switch on the Home page.</p>
  }

  return (
    <section className="page">
      <h2>{symbols.join(', ')} to USD</h2>
      {error && <p className="error">{error}</p>}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis label={{ value: 'Coin Value', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {symbols.map((symbol, i) => (
            <Line
              key={symbol}
              dataKey={symbol}
              stroke={COLORS[i]}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}
