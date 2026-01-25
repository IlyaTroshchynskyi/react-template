import { memo, useCallback } from 'react'
import { Card, CardContent, Checkbox, IconButton, Typography, Chip, Box, Stack, Tooltip } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

const priorityConfig = {
  high: { color: 'error' as const, label: 'High' },
  medium: { color: 'warning' as const, label: 'Medium' },
  low: { color: 'success' as const, label: 'Low' },
}

export const TodoItem = memo(({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const handleToggle = useCallback(() => onToggle(todo), [onToggle, todo])
  const handleDelete = useCallback(() => onDelete(todo.id), [onDelete, todo.id])
  const handleEdit = useCallback(() => onEdit(todo), [onEdit, todo])

  const priority = priorityConfig[todo.priority]
  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        opacity: todo.completed ? 0.7 : 1,
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
        <Checkbox
          checked={todo.completed}
          onChange={handleToggle}
          sx={{
            mt: -0.5,
            '&.Mui-checked': {
              color: 'primary.main',
            },
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 0.5 }}>
            <Typography
              variant='subtitle1'
              sx={{
                fontWeight: 600,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.disabled' : 'text.primary',
              }}
            >
              {todo.title}
            </Typography>
            <Chip
              label={priority.label}
              color={priority.color}
              size='small'
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Stack>

          {todo.description && (
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {todo.description}
            </Typography>
          )}

          <Typography variant='caption' color='text.disabled'>
            {formattedDate}
          </Typography>
        </Box>

        <Stack direction='row' spacing={0.5}>
          <Tooltip title='Edit'>
            <IconButton size='small' onClick={handleEdit} color='primary'>
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' onClick={handleDelete} color='error'>
              <DeleteOutlineIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  )
})
