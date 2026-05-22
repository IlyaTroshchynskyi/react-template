import type { Todo } from '@features/todos/types'

export const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Learn Playwright',
    description: 'Set up E2E testing with route mocking',
    completed: false,
    priority: 'high',
    createdAt: '2026-05-22T10:00:00.000Z',
    updatedAt: '2026-05-22T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Write smoke test',
    description: 'Verify app loads end-to-end',
    completed: false,
    priority: 'medium',
    createdAt: '2026-05-22T11:00:00.000Z',
    updatedAt: '2026-05-22T11:00:00.000Z',
  },
  {
    id: '3',
    title: 'Wire up CI',
    description: 'GitHub Actions workflow with artifact upload',
    completed: true,
    priority: 'low',
    createdAt: '2026-05-22T12:00:00.000Z',
    updatedAt: '2026-05-22T12:00:00.000Z',
  },
]
