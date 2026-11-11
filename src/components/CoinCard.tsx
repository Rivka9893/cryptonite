import { useState } from 'react'
import { arePricesFresh, loadPrices } from '../store/coinsSlice'
import { useAppDispatch, useAppSelector } from '../store/store'
import type { Coin } from '../types'

interface Props {
  coin: Coin
  checked: boolean
  onToggle: (coin: Coin, checked: boolean) => void
}

export default function CoinCard({ coin, checked, onToggle }: Props) {
  const dispatch = useAppDispatch()
  const prices = useAppSelector((state) => state.coins.prices[coin.id])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)

  function toggleInfo() {
    setOpen(!open)
    if (!open && !arePricesFresh(prices)) {
      setError(false)
      dispatch(loadPrices(coin.id)).unwrap().catch(() => setError(true))
    }
  }

  return (
    <div className="card">
      <div className="card-top">
        <img src={coin.image} alt={coin.name} width={40} height={40} />
        <div className="card-names">
          <strong>{coin.symbol.toUpperCase()}</strong>
          <span>{coin.name}</span>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onToggle(coin, e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {open && (
        <div className="prices">
          {prices && (
            <>
              <div>$ {prices.usd}</div>
              <div>€ {prices.eur}</div>
              <div>₪ {prices.ils}</div>
            </>
          )}
          {!prices && !error && <div>Loading...</div>}
          {!prices && error && <div className="error">Failed to load prices</div>}
        </div>
      )}

      <button className={open ? 'info-btn close' : 'info-btn'} onClick={toggleInfo}>
        {open ? 'Close Info' : 'More Info'}
      </button>
    </div>
  )
}
