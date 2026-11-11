import { useEffect, useState } from 'react'
import CoinCard from '../components/CoinCard'
import MaxCoinsDialog from '../components/MaxCoinsDialog'
import { MAX_SELECTED, addCoin, loadCoins, removeCoin } from '../store/coinsSlice'
import { useAppDispatch, useAppSelector } from '../store/store'
import type { Coin } from '../types'

export default function Home() {
  const dispatch = useAppDispatch()
  const { coins, status, search, selected } = useAppSelector((state) => state.coins)
  const [pendingCoin, setPendingCoin] = useState<Coin | null>(null)

  useEffect(() => {
    dispatch(loadCoins())
  }, [dispatch])

  const text = search.trim().toLowerCase()
  const visibleCoins = coins.filter(
    (coin) => coin.name.toLowerCase().includes(text) || coin.symbol.toLowerCase().includes(text),
  )

  function handleToggle(coin: Coin, checked: boolean) {
    if (!checked) {
      dispatch(removeCoin(coin.id))
    } else if (selected.length < MAX_SELECTED) {
      dispatch(addCoin(coin))
    } else {
      setPendingCoin(coin)
    }
  }

  function handleReplace(coinToRemove: Coin) {
    dispatch(removeCoin(coinToRemove.id))
    dispatch(addCoin(pendingCoin!))
    setPendingCoin(null)
  }

  if (status === 'loading' || status === 'idle') return <p className="message">Loading coins...</p>
  if (status === 'error') return <p className="message error">Failed to load coins. Try again later.</p>

  return (
    <>
      {visibleCoins.length === 0 && <p className="message">No coins found</p>}
      <div className="cards">
        {visibleCoins.map((coin) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            checked={selected.some((s) => s.id === coin.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {pendingCoin && (
        <MaxCoinsDialog
          newCoin={pendingCoin}
          selected={selected}
          onConfirm={handleReplace}
          onClose={() => setPendingCoin(null)}
        />
      )}
    </>
  )
}
