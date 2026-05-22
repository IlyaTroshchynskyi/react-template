import type { Page } from '@playwright/test'
import type { Todo } from '@features/todos/types'
import { mockTodos } from './data/todos'

const API_BASE = process.env.API_URL ?? 'http://localhost:3001'

export async function setupMockRoutes(page: Page) {
  const todos: Todo[] = mockTodos.map(t => ({ ...t }))

  await page.route(
    url => new URL(url).origin + new URL(url).pathname === `${API_BASE}/todos`,
    async route => {
      const request = route.request()
      if (request.method() === 'GET') {
        await route.fulfill({ status: 200, json: todos })
        return
      }
      if (request.method() === 'POST') {
        const body = (request.postDataJSON() ?? {}) as Partial<Todo>
        const created: Todo = {
          id: String(Date.now()),
          title: body.title ?? '',
          description: body.description ?? '',
          completed: body.completed ?? false,
          priority: body.priority ?? 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        todos.push(created)
        await route.fulfill({ status: 201, json: created })
        return
      }
      await route.fallback()
    }
  )

  await page.route(/\/todos\/([^/?]+)$/, async route => {
    const request = route.request()
    const url = new URL(request.url())
    const id = url.pathname.split('/').pop() as string
    const idx = todos.findIndex(t => t.id === id)

    if (idx === -1) {
      await route.fulfill({ status: 404, json: { error: 'Not found' } })
      return
    }

    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, json: todos[idx] })
      return
    }
    if (request.method() === 'PATCH' || request.method() === 'PUT') {
      const updates = (request.postDataJSON() ?? {}) as Partial<Todo>
      todos[idx] = { ...todos[idx], ...updates, updatedAt: new Date().toISOString() }
      await route.fulfill({ status: 200, json: todos[idx] })
      return
    }
    if (request.method() === 'DELETE') {
      todos.splice(idx, 1)
      await route.fulfill({ status: 200, json: {} })
      return
    }
    await route.fallback()
  })
}
