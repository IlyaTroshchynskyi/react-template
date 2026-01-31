import { useState, useCallback, useMemo } from 'react'
import { Stack, Dialog, DialogContent, Button, Box, Snackbar, Alert } from '@mui/material'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { TodoForm, TodoFilters, TodoList } from '@features/todos/components'
import { useTodoFilters } from '@features/todos/hooks/useTodoFilters'
import {
  useTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
} from '@features/todos/api/queries'
import { filterAndSortTodos, calculateTodoStats } from '@features/todos/utils/todoUtils'
import type { Todo } from '@features/todos/types'
import type { TodoFormValues } from '@features/todos/validation/todoSchema'

type NotificationType = 'success' | 'error' | 'info'

interface Notification {
  open: boolean
  message: string
  type: NotificationType
}

export const TodosPage = () => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: '',
    type: 'success',
  })

  const showNotification = useCallback((message: string, type: NotificationType) => {
    setNotification({ open: true, message, type })
  }, [])

  // URL-based filters
  const { filter, sortBy, search, setFilter, setSortBy, setSearch } = useTodoFilters()

  // React Query hooks - destructure with renamed mutateAsync
  const todosQuery = useTodosQuery()
  const { mutateAsync: createTodo, isPending: isCreating } = useCreateTodoMutation()
  const { mutateAsync: updateTodo, isPending: isUpdating } = useUpdateTodoMutation()
  const { mutateAsync: deleteTodo } = useDeleteTodoMutation()
  const { mutate: toggleTodo } = useToggleTodoMutation()

  // Filter and sort todos
  const todos = useMemo(
    () =>
      filterAndSortTodos({
        todos: todosQuery.data ?? [],
        filter,
        sortBy,
        searchQuery: search,
      }),
    [todosQuery.data, filter, sortBy, search]
  )

  // Calculate stats
  const stats = useMemo(() => calculateTodoStats(todosQuery.data ?? []), [todosQuery.data])

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }))
  }, [])

  // No need to include createTodo in deps - mutateAsync is stable
  const handleCreateSubmit = useCallback(
    async (values: TodoFormValues) => {
      try {
        await createTodo(values)
        showNotification('Todo created successfully!', 'success')
      } catch {
        showNotification('Failed to create todo', 'error')
      }
    },
    [createTodo, showNotification]
  )

  const handleEditSubmit = useCallback(
    async (values: TodoFormValues) => {
      if (editingTodo) {
        try {
          await updateTodo({ id: editingTodo.id, ...values })
          showNotification('Todo updated successfully!', 'success')
          setEditingTodo(null)
          setIsFormOpen(false)
        } catch {
          showNotification('Failed to update todo', 'error')
        }
      }
    },
    [updateTodo, editingTodo, showNotification]
  )

  const handleEdit = useCallback((todo: Todo) => {
    setEditingTodo(todo)
    setIsFormOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setEditingTodo(null)
    setIsFormOpen(false)
  }, [])

  const handleToggle = useCallback(
    (todo: Todo) => {
      toggleTodo({ id: todo.id, completed: todo.completed })
    },
    [toggleTodo]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTodo(id)
        showNotification('Todo deleted successfully!', 'success')
      } catch {
        showNotification('Failed to delete todo', 'error')
      }
    },
    [deleteTodo, showNotification]
  )

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(t => t.completed)
    try {
      await Promise.all(completedTodos.map(t => deleteTodo(t.id)))
      showNotification('Cleared completed todos', 'info')
    } catch {
      showNotification('Failed to clear completed todos', 'error')
    }
  }, [todos, deleteTodo, showNotification])

  return (
    <Stack spacing={3}>
      {/* Create Todo Form */}
      <TodoForm onSubmit={handleCreateSubmit} isLoading={isCreating} />

      {/* Filters */}
      <TodoFilters
        filter={filter}
        sortBy={sortBy}
        searchQuery={search}
        stats={stats}
        onFilterChange={setFilter}
        onSortChange={setSortBy}
        onSearchChange={setSearch}
      />

      {/* Clear completed button */}
      {stats.completed > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='outlined'
            color='error'
            size='small'
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearCompleted}
          >
            Clear Completed ({stats.completed})
          </Button>
        </Box>
      )}

      {/* Todo List */}
      <TodoList
        todos={todos}
        isLoading={todosQuery.isLoading}
        isError={todosQuery.isError}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onRefetch={todosQuery.refetch}
      />

      {/* Edit Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <TodoForm
            onSubmit={handleEditSubmit}
            initialData={editingTodo}
            onCancel={handleCloseDialog}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.type} variant='filled' sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

export default TodosPage
