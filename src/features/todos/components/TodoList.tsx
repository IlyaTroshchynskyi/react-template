import { Stack, Typography, Box, CircularProgress, Alert, Button } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import InboxIcon from '@mui/icons-material/Inbox'
import type { Todo } from '../types'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  isLoading: boolean
  isError: boolean
  onToggle: (todo: Todo) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
  onRefetch: () => void
}

export const TodoList = ({ todos, isLoading, isError, onToggle, onDelete, onEdit, onRefetch }: TodoListProps) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert
        severity='error'
        action={
          <Button color='inherit' size='small' startIcon={<RefreshIcon />} onClick={onRefetch}>
            Retry
          </Button>
        }
      >
        Failed to load todos. Please try again.
      </Alert>
    )
  }

  if (todos.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
          color: 'text.secondary',
        }}
      >
        <InboxIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant='h6' color='inherit'>
          No todos found
        </Typography>
        <Typography variant='body2' color='inherit'>
          Create your first todo to get started!
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </Stack>
  )
}
