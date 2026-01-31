import type { RootState } from '@app/store'

export const selectTodosItems = (state: RootState) => state.todos.items

export const selectTodosFilter = (state: RootState) => state.todos.selectedFilter

export const selectTodosLoading = (state: RootState) => state.todos.loading

export const selectTodosError = (state: RootState) => state.todos.error
