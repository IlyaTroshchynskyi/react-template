import type { Todo, TodoFilter, TodoSortBy } from '../types'

const priorityOrder = { high: 0, medium: 1, low: 2 }

interface FilterAndSortParams {
  todos: Todo[]
  filter: TodoFilter
  sortBy: TodoSortBy
  searchQuery: string
}

/**
 * TODO: This filtering and sorting should be done on the backend!
 *
 * For production apps:
 * - Backend should handle filtering (GET /todos?status=active&priority=high)
 * - Backend should handle sorting (GET /todos?sortBy=createdAt&order=desc)
 * - Backend should handle search (GET /todos?search=react)
 * - Backend should handle pagination (GET /todos?page=1&limit=20)
 *
 * Benefits:
 * - Better performance (don't send unnecessary data)
 * - Reduced bundle size
 * - Scalability (works with large datasets)
 * - Less client-side processing
 *
 * This client-side implementation is just for demonstration purposes!
 */
export const filterAndSortTodos = ({ todos, filter, sortBy, searchQuery }: FilterAndSortParams): Todo[] => {
  let filtered = [...todos]

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      todo => todo.title.toLowerCase().includes(query) || todo.description.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  switch (filter) {
    case 'active':
      filtered = filtered.filter(todo => !todo.completed)
      break
    case 'completed':
      filtered = filtered.filter(todo => todo.completed)
      break
    case 'all':
    default:
      // No filtering needed
      break
  }

  // Apply sorting
  switch (sortBy) {
    case 'priority':
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      break
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'createdAt':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }

  return filtered
}

/**
 * Calculate statistics from todos array
 * TODO: This should also come from the backend in production!
 */
export const calculateTodoStats = (todos: Todo[]) => ({
  total: todos.length,
  completed: todos.filter(t => t.completed).length,
  active: todos.filter(t => !t.completed).length,
  highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length,
})
