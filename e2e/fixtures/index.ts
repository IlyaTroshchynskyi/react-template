import { test as base, expect } from '@playwright/test'
import { TodosPage } from '../pages/TodosPage'
import { setupMockRoutes } from '../mocks/handlers'

interface Fixtures {
  mockRoutes: void
  todosPage: TodosPage
}

export const test = base.extend<Fixtures>({
  mockRoutes: [
    async ({ page }, use) => {
      // process.env values are always strings — compare explicitly so the literal
      // "false" in .env.e2e does not become a truthy guard that skips mocks.
      if (process.env.USE_REAL_BACKEND !== 'true') {
        await setupMockRoutes(page)
      }
      await use()
    },
    { auto: false },
  ],
  todosPage: async ({ page, mockRoutes: _mockRoutes }, use) => {
    await use(new TodosPage(page))
  },
})

export { expect }
