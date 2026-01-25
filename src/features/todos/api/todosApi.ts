import { axiosInstance } from '../../../shared/api'
import { API_ENDPOINTS } from '../../../shared/constants'
import type { Todo } from '../types'
import type { TodoFormValues } from '../validation/todoSchema'

export const fetchTodos = async (): Promise<Todo[]> => {
  const { data } = await axiosInstance.get<Todo[]>(API_ENDPOINTS.TODOS)
  return data
}

export const fetchTodoById = async (id: string): Promise<Todo> => {
  const { data } = await axiosInstance.get<Todo>(`${API_ENDPOINTS.TODOS}/${id}`)
  return data
}

export const createTodo = async (input: TodoFormValues): Promise<Todo> => {
  const now = new Date().toISOString()
  const todoData = {
    ...input,
    completed: false,
    createdAt: now,
    updatedAt: now,
  }

  const { data } = await axiosInstance.post<Todo>(API_ENDPOINTS.TODOS, todoData)
  return data
}

export const updateTodo = async (id: string, todoData: Omit<Todo, 'id'>): Promise<Todo> => {
  const { data } = await axiosInstance.put<Todo>(`${API_ENDPOINTS.TODOS}/${id}`, {
    id,
    ...todoData,
  })
  return data
}

export const patchTodo = async (id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo> => {
  const { data } = await axiosInstance.patch<Todo>(`${API_ENDPOINTS.TODOS}/${id}`, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
  return data
}

export const deleteTodo = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.TODOS}/${id}`)
}
