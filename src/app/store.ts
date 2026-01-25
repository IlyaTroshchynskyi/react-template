import { configureStore } from '@reduxjs/toolkit'
import { uiSlice } from '../features/ui/slice/uiSlice'
import { todosSlice } from '../features/todos/slice/todosSlice'

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    todos: todosSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
