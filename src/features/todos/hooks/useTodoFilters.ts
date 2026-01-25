import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import type { TodoFilter, TodoSortBy } from '../types'

interface TodoFiltersState {
  filter: TodoFilter
  sortBy: TodoSortBy
  search: string
}

interface UseTodoFiltersReturn extends TodoFiltersState {
  setFilter: (filter: TodoFilter) => void
  setSortBy: (sortBy: TodoSortBy) => void
  setSearch: (search: string) => void
  resetFilters: () => void
}

const DEFAULT_FILTER: TodoFilter = 'all'
const DEFAULT_SORT: TodoSortBy = 'createdAt'

export const useTodoFilters = (): UseTodoFiltersReturn => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filter = (searchParams.get('filter') as TodoFilter) || DEFAULT_FILTER
  const sortBy = (searchParams.get('sortBy') as TodoSortBy) || DEFAULT_SORT
  const search = searchParams.get('search') || ''

  const updateParams = useCallback(
    (updates: Partial<Record<string, string>>) => {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev)

        Object.entries(updates).forEach(([key, value]) => {
          if (value && value !== '') {
            newParams.set(key, value)
          } else {
            newParams.delete(key)
          }
        })

        // Remove default values from URL to keep it clean
        if (newParams.get('filter') === DEFAULT_FILTER) {
          newParams.delete('filter')
        }
        if (newParams.get('sortBy') === DEFAULT_SORT) {
          newParams.delete('sortBy')
        }

        return newParams
      })
    },
    [setSearchParams]
  )

  const setFilter = useCallback((newFilter: TodoFilter) => updateParams({ filter: newFilter }), [updateParams])

  const setSortBy = useCallback((newSortBy: TodoSortBy) => updateParams({ sortBy: newSortBy }), [updateParams])

  const setSearch = useCallback((newSearch: string) => updateParams({ search: newSearch }), [updateParams])

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return {
    filter,
    sortBy,
    search,
    setFilter,
    setSortBy,
    setSearch,
    resetFilters,
  }
}
