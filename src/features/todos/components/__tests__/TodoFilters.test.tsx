import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, screen } from '@test'
import { TodoFilters } from '../TodoFilters'

describe('TodoFilters', () => {
  const defaultProps = {
    filter: 'all' as const,
    sortBy: 'createdAt' as const,
    searchQuery: '',
    stats: { total: 10, completed: 3, active: 7 },
    onFilterChange: vi.fn(),
    onSortChange: vi.fn(),
    onSearchChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderTodoFilters = (props = {}) => renderWithProviders(<TodoFilters {...defaultProps} {...props} />)

  describe('stats display', () => {
    it('should display total count', () => {
      renderTodoFilters()

      expect(screen.getByText('Total: 10')).toBeInTheDocument()
    })

    it('should display active count', () => {
      renderTodoFilters()

      expect(screen.getByText('Active: 7')).toBeInTheDocument()
    })

    it('should display completed count', () => {
      renderTodoFilters()

      expect(screen.getByText('Completed: 3')).toBeInTheDocument()
    })

    it('should update when stats change', () => {
      renderTodoFilters({
        stats: { total: 50, completed: 25, active: 25 },
      })

      expect(screen.getByText('Total: 50')).toBeInTheDocument()
      expect(screen.getByText('Active: 25')).toBeInTheDocument()
      expect(screen.getByText('Completed: 25')).toBeInTheDocument()
    })
  })

  describe('search input', () => {
    it('should render search input', () => {
      renderTodoFilters({ searchQuery: 'test search' })

      expect(screen.getByPlaceholderText(/search todos/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/search todos/i)).toHaveValue('test search')
    })
  })
})
