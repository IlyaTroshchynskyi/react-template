import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../../test'
import { TodosPage } from '../TodosPage'
import { resetTodos } from '../../test'
import { todoFactory } from '../../test'

describe('TodosPage', () => {
  beforeEach(() => {
    resetTodos([])
    vi.clearAllMocks()
  })

  const renderTodosPage = () => renderWithProviders(<TodosPage />)

  describe('displaying todos', () => {
    it('should display todos after loading', async () => {
      const todos = [todoFactory.build({ title: 'First Todo' }), todoFactory.build({ title: 'Second Todo' })]
      resetTodos(todos)

      renderTodosPage()

      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument()
        expect(screen.getByText('Second Todo')).toBeInTheDocument()
      })
    })
  })

  describe('creating todos', () => {
    it('should create a new todo', async () => {
      const { user } = renderTodosPage()

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })

      // Fill the form
      await user.type(screen.getByLabelText(/title/i), 'New Test Todo')
      await user.type(screen.getByLabelText(/description/i), 'Test description')

      // Submit
      await user.click(screen.getByRole('button', { name: /add todo/i }))

      // Check success notification
      await waitFor(() => {
        expect(screen.getByText(/todo created successfully/i)).toBeInTheDocument()
      })
    }, 10000)
  })

  describe('deleting todos', () => {
    it('should delete a todo', async () => {
      const todo = todoFactory.build({ title: 'Delete Me' })
      resetTodos([todo])

      const { user } = renderTodosPage()

      await waitFor(() => {
        expect(screen.getByText('Delete Me')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /delete/i }))

      await waitFor(() => {
        expect(screen.getByText(/todo deleted successfully/i)).toBeInTheDocument()
      })
    })
  })
})
