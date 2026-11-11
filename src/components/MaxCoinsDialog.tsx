import { useState } from 'react'
import { MAX_SELECTED } from '../store/coinsSlice'
import type { Coin } from '../types'

interface Props {
  newCoin: Coin
  selected: Coin[]
  onConfirm: (coinToRemove: Coin) => void
  onClose: () => void
}

export default function MaxCoinsDialog({ newCoin, selected, onConfirm, onClose }: Props) {
  const [removeId, setRemoveId] = useState('')

  function handleConfirm() {
    const coinToRemove = selected.find((coin) => coin.id === removeId)
    if (coinToRemove) {
      onConfirm(coinToRemove)
    }
  }

  return (
    <div className="overlay">
      <div className="dialog">
        <h2>Maximum Coins Reached</h2>
        <p>
          You can select up to {MAX_SELECTED} coins. To add {newCoin.symbol.toUpperCase()},
          please choose one to remove:
        </p>
        {selected.map((coin) => (
          <label key={coin.id} className="dialog-option">
            <input
              type="radio"
              name="coinToRemove"
              checked={removeId === coin.id}
              onChange={() => setRemoveId(coin.id)}
            />
            {coin.symbol.toUpperCase()}
          </label>
        ))}
        <div className="dialog-buttons">
          <button className="confirm" disabled={!removeId} onClick={handleConfirm}>
            Confirm
          </button>
          <button className="cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
