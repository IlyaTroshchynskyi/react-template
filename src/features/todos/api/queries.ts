import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { fetchTodos, fetchTodoById, createTodo, patchTodo, deleteTodo } from './todosApi'
import type { UpdateTodoDto } from '../types'
import type { TodoFormValues } from '../validation/todoSchema'

// Query keys factory
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

export const useTodosQuery = () =>
  useQuery({
    queryKey: todoKeys.lists(),
    queryFn: fetchTodos,
  })

export const useTodosSuspenseQuery = () => {
  return useSuspenseQuery({
    queryKey: todoKeys.lists(),
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return fetchTodos()
    },
  })
}

export const useTodoQuery = (id: string) => {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodoById(id),
    enabled: !!id,
  })
}

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: TodoFormValues) => createTodo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...updates }: UpdateTodoDto) => patchTodo(id, updates),
    onSuccess: updatedTodo => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(updatedTodo.id) })
    },
  })
}

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

export const useToggleTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => patchTodo(id, { completed: !completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
