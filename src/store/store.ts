import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import coinsReducer, { saveSelected } from './coinsSlice'

export const store = configureStore({
  reducer: { coins: coinsReducer },
})

// Keep the selected coins after the browser is closed
let lastSelected = store.getState().coins.selected
store.subscribe(() => {
  const { selected } = store.getState().coins
  if (selected !== lastSelected) {
    lastSelected = selected
    saveSelected(selected)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
