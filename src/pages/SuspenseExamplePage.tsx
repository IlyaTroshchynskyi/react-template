import { Suspense } from 'react'
import { Box, Typography, Card, CardContent, Stack, Chip, Alert, Paper } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { ErrorBoundary } from 'react-error-boundary'
import { useTodosSuspenseQuery } from '@features/todos/api/queries'
import { LoadingFallback, ErrorFallback } from '@shared/components'

const SuspendedTodoList = () => {
  const { data: todos } = useTodosSuspenseQuery()

  if (todos.length === 0) {
    return <Alert severity='info'>No todos found. Add some todos on the main page!</Alert>
  }

  return (
    <Stack spacing={2}>
      {todos.map(todo => (
        <Card key={todo.id} variant='outlined'>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {todo.completed ? <CheckCircleIcon color='success' /> : <RadioButtonUncheckedIcon color='action' />}
              <Typography
                variant='h6'
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary',
                }}
              >
                {todo.title}
              </Typography>
            </Box>
            {todo.description && (
              <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
                {todo.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, mt: 1, ml: 4 }}>
              <Chip
                size='small'
                label={todo.completed ? 'Completed' : 'Pending'}
                color={todo.completed ? 'success' : 'warning'}
                variant='outlined'
              />
              <Chip size='small' label={new Date(todo.createdAt).toLocaleDateString()} variant='outlined' />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}

export const SuspenseExamplePage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom fontWeight={700}>
        React Suspense Example
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }} variant='outlined'>
        <Typography variant='h6' gutterBottom>
          How it works
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          This page demonstrates how to use <code>useSuspenseQuery</code> from React Query with React's{' '}
          <code>Suspense</code> component. Unlike regular <code>useQuery</code>, the suspense version will suspend the
          component tree while loading, allowing the parent
          <code> Suspense</code> boundary to show a fallback.
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Benefits:
        </Typography>
        <Box component='ul' sx={{ mt: 1, pl: 2 }}>
          <Typography component='li' variant='body2' color='text.secondary'>
            Cleaner component code - no need to handle loading states inline
          </Typography>
          <Typography component='li' variant='body2' color='text.secondary'>
            Declarative loading UI at the boundary level
          </Typography>
          <Typography component='li' variant='body2' color='text.secondary'>
            Works great with React 18+ concurrent features
          </Typography>
          <Typography component='li' variant='body2' color='text.secondary'>
            ErrorBoundary catches any errors thrown during fetch
          </Typography>
        </Box>
      </Paper>

      <Typography variant='h5' gutterBottom fontWeight={600}>
        Todo List (with Suspense)
      </Typography>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <SuspendedTodoList />
        </Suspense>
      </ErrorBoundary>
    </Box>
  )
}

export default SuspenseExamplePage
