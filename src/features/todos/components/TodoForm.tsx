import { useFormik } from 'formik'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { todoValidationSchema, type TodoFormValues, initialTodoValues } from '../validation/todoSchema'
import type { Todo } from '../types'

interface TodoFormProps {
  onSubmit: (values: TodoFormValues) => Promise<void>
  initialData?: Todo | null
  onCancel?: () => void
  isLoading?: boolean
}

export const TodoForm = ({ onSubmit, initialData, onCancel, isLoading }: TodoFormProps) => {
  const isEditing = !!initialData

  const formik = useFormik<TodoFormValues>({
    initialValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          priority: initialData.priority,
        }
      : initialTodoValues,
    validationSchema: todoValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values)
      if (!isEditing) {
        resetForm()
      }
    },
  })

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: theme => theme.palette.background.paper,
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        {isEditing ? <EditIcon /> : <AddIcon />}
        {isEditing ? 'Edit Todo' : 'Create New Todo'}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            id='title'
            name='title'
            label='Title'
            placeholder='What needs to be done?'
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            autoFocus
          />

          <TextField
            fullWidth
            id='description'
            name='description'
            label='Description'
            placeholder='Add more details...'
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <FormControl fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
            <InputLabel id='priority-label'>Priority</InputLabel>
            <Select
              labelId='priority-label'
              id='priority'
              name='priority'
              value={formik.values.priority}
              label='Priority'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value='low'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                  Low
                </Box>
              </MenuItem>
              <MenuItem value='medium'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
                  Medium
                </Box>
              </MenuItem>
              <MenuItem value='high'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main' }} />
                  High
                </Box>
              </MenuItem>
            </Select>
            {formik.touched.priority && formik.errors.priority && (
              <FormHelperText>{formik.errors.priority}</FormHelperText>
            )}
          </FormControl>

          <Stack direction='row' spacing={2} justifyContent='flex-end'>
            {onCancel && (
              <Button variant='outlined' onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button
              type='submit'
              variant='contained'
              disabled={isLoading || !formik.isValid}
              startIcon={
                isLoading ? <CircularProgress size={20} color='inherit' /> : isEditing ? <EditIcon /> : <AddIcon />
              }
            >
              {isEditing ? 'Update Todo' : 'Add Todo'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  )
}
