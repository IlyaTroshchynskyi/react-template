import * as Yup from 'yup'

export const todoValidationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: Yup.string().max(500, 'Description must be less than 500 characters'),
  priority: Yup.string().oneOf(['low', 'medium', 'high'], 'Invalid priority').required('Priority is required'),
})

export interface TodoFormValues {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export const initialTodoValues: TodoFormValues = {
  title: '',
  description: '',
  priority: 'medium',
}
