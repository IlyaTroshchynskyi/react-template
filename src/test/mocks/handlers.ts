import { http, HttpResponse, delay } from 'msw'
import type { Todo } from '@features/todos/types'
import type { TodoFormValues } from '@features/todos/validation/todoSchema'
import { todoFactory } from '@test/factories'

// In-memory store for todos during tests
let todos: Todo[] = []

// Reset todos to initial state
export const resetTodos = (initialTodos: Todo[] = []) => {
  todos = [...initialTodos]
}

// Get current todos (useful for assertions)
export const getTodos = () => [...todos]

const API_BASE_URL = 'http://localhost:3001'

export const handlers = [
  http.get(`${API_BASE_URL}/todos`, async () => {
    await delay(50) // Simulate network delay
    return HttpResponse.json(todos)
  }),

  http.get(`${API_BASE_URL}/todos/:id`, async ({ params }) => {
    await delay(50)
    const { id } = params
    const todo = todos.find(t => t.id === id)

    if (!todo) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(todo)
  }),

  http.post(`${API_BASE_URL}/todos`, async ({ request }) => {
    await delay(50)
    const body = (await request.json()) as TodoFormValues & {
      completed: boolean
      createdAt: string
      updatedAt: string
    }

    const newTodo = todoFactory.build({
      title: body.title,
      description: body.description,
      priority: body.priority,
      completed: body.completed ?? false,
      createdAt: body.createdAt ?? new Date().toISOString(),
      updatedAt: body.updatedAt ?? new Date().toISOString(),
    })

    todos.unshift(newTodo)
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  http.put(`${API_BASE_URL}/todos/:id`, async ({ params, request }) => {
    await delay(50)
    const { id } = params
    const body = (await request.json()) as Partial<Todo>

    const todoIndex = todos.findIndex(t => t.id === id)
    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedTodo: Todo = {
      ...todos[todoIndex],
      ...body,
      id: id as string,
      updatedAt: new Date().toISOString(),
    }

    todos[todoIndex] = updatedTodo
    return HttpResponse.json(updatedTodo)
  }),

  http.patch(`${API_BASE_URL}/todos/:id`, async ({ params, request }) => {
    await delay(50)
    const { id } = params
    const body = (await request.json()) as Partial<Todo>

    const todoIndex = todos.findIndex(t => t.id === id)
    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedTodo: Todo = {
      ...todos[todoIndex],
      ...body,
      id: id as string,
    }

    todos[todoIndex] = updatedTodo
    return HttpResponse.json(updatedTodo)
  }),

  http.delete(`${API_BASE_URL}/todos/:id`, async ({ params }) => {
    await delay(50)
    const { id } = params

    const todoIndex = todos.findIndex(t => t.id === id)
    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    todos.splice(todoIndex, 1)
    return new HttpResponse(null, { status: 200 })
  }),
]

export const errorHandlers = {
  fetchTodosError: http.get(`${API_BASE_URL}/todos`, () => {
    return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }),

  fetchTodoByIdError: http.get(`${API_BASE_URL}/todos/:id`, () => {
    return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
  }),

  createTodoError: http.post(`${API_BASE_URL}/todos`, () => {
    return HttpResponse.json({ message: 'Failed to create todo' }, { status: 500 })
  }),

  updateTodoError: http.patch(`${API_BASE_URL}/todos/:id`, () => {
    return HttpResponse.json({ message: 'Failed to update todo' }, { status: 500 })
  }),

  deleteTodoError: http.delete(`${API_BASE_URL}/todos/:id`, () => {
    return HttpResponse.json({ message: 'Failed to delete todo' }, { status: 500 })
  }),

  networkError: http.get(`${API_BASE_URL}/todos`, () => {
    return HttpResponse.error()
  }),
}
