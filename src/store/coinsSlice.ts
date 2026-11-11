import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchCoinPrices, fetchCoinsList } from '../api'
import type { Coin, CoinPrices } from '../types'

export const MAX_SELECTED = 5
const STORAGE_KEY = 'selectedCoins'
const PRICES_TTL_MS = 2 * 60 * 1000

interface CoinsState {
  coins: Coin[]
  status: 'idle' | 'loading' | 'done' | 'error'
  search: string
  selected: Coin[]
  prices: Record<string, CoinPrices>
}

function loadSelected(): Coin[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveSelected(selected: Coin[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selected))
}

export function arePricesFresh(prices?: CoinPrices) {
  return prices !== undefined && Date.now() - prices.time < PRICES_TTL_MS
}

// Fetch the list only once; later visits to the home page use the stored list
export const loadCoins = createAsyncThunk('coins/loadCoins', fetchCoinsList, {
  condition: (_, { getState }) => {
    const { status } = (getState() as { coins: CoinsState }).coins
    return status === 'idle' || status === 'error'
  },
})

export const loadPrices = createAsyncThunk('coins/loadPrices', async (id: string) => {
  const prices = await fetchCoinPrices(id)
  return { id, prices: { ...prices, time: Date.now() } }
})

const initialState: CoinsState = {
  coins: [],
  status: 'idle',
  search: '',
  selected: loadSelected(),
  prices: {},
}

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    addCoin(state, action: PayloadAction<Coin>) {
      if (state.selected.length < MAX_SELECTED) {
        state.selected.push(action.payload)
      }
    },
    removeCoin(state, action: PayloadAction<string>) {
      state.selected = state.selected.filter((coin) => coin.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCoins.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadCoins.fulfilled, (state, action) => {
        state.status = 'done'
        state.coins = action.payload
      })
      .addCase(loadCoins.rejected, (state) => {
        state.status = 'error'
      })
      .addCase(loadPrices.fulfilled, (state, action) => {
        state.prices[action.payload.id] = action.payload.prices
      })
  },
})

export const { setSearch, addCoin, removeCoin } = coinsSlice.actions
export default coinsSlice.reducer
