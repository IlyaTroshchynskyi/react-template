import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, screen, waitFor, todoFactory } from '@test'
import { TodoForm } from '../TodoForm'

describe('TodoForm', () => {
  const defaultProps = {
    onSubmit: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderTodoForm = (props = {}) => renderWithProviders(<TodoForm {...defaultProps} {...props} />)
  describe('edit mode', () => {
    it('should populate fields with initial data', () => {
      const todo = todoFactory.build({
        title: 'Existing Title',
        description: 'Existing Description',
      })

      renderTodoForm({ initialData: todo })

      expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Title')
      expect(screen.getByLabelText(/description/i)).toHaveValue('Existing Description')
    })

    it('should show Update Todo button', () => {
      const todo = todoFactory.build()

      renderTodoForm({ initialData: todo })

      expect(screen.getByRole('button', { name: /update todo/i })).toBeInTheDocument()
    })
  })

  describe('form validation', () => {
    it('should show error for empty title on blur', async () => {
      const { user } = renderTodoForm()

      const titleInput = screen.getByLabelText(/title/i)
      await user.click(titleInput)
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for short title', async () => {
      const { user } = renderTodoForm()

      const titleInput = screen.getByLabelText(/title/i)
      await user.type(titleInput, 'ab')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument()
      })
    })

    it('should disable submit button when form is invalid', async () => {
      const { user } = renderTodoForm()

      // Touch the title field to trigger validation
      const titleInput = screen.getByLabelText(/title/i)
      await user.click(titleInput)
      await user.tab()

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add todo/i })).toBeDisabled()
      })
    })
  })
  describe('loading state', () => {
    it('should show loading indicator when isLoading is true', () => {
      renderTodoForm({ isLoading: true })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should disable submit button when loading', () => {
      const todo = todoFactory.build()

      renderTodoForm({ initialData: todo, isLoading: true })

      expect(screen.getByRole('button', { name: /update todo/i })).toBeDisabled()
    })

    it('should disable cancel button when loading', () => {
      const todo = todoFactory.build()

      renderTodoForm({ initialData: todo, onCancel: vi.fn(), isLoading: true })

      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    })
  })
})
