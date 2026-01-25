import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  theme: 'light' | 'dark'
}

const initialState: UiState = {
  theme: 'dark',
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
  },
})

export const { toggleTheme, setTheme } = uiSlice.actions
