import { describe, it, expect } from 'vitest'
import { todosSlice, setFilter, clearError, type TodosState } from '../todosSlice'

describe('todosSlice', () => {
  const reducer = todosSlice.reducer

  const createInitialState = (overrides: Partial<TodosState> = {}): TodosState => ({
    items: [],
    selectedFilter: 'all',
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
    },
    error: null,
    ...overrides,
  })

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, { type: 'unknown' })

      expect(state).toEqual(createInitialState())
    })
  })

  describe('setFilter', () => {
    it('should set filter to active', () => {
      const initialState = createInitialState()

      const state = reducer(initialState, setFilter('active'))

      expect(state.selectedFilter).toBe('active')
    })
  })

  describe('clearError', () => {
    it('should clear the error state', () => {
      const initialState = createInitialState({ error: 'Some error message' })

      const state = reducer(initialState, clearError())

      expect(state.error).toBeNull()
    })
  })
})
