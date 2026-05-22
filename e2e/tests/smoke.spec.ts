import { test, expect } from '../fixtures'

test('app loads and todos page is visible', async ({ todosPage }) => {
  await todosPage.goto()

  await expect(todosPage.heading).toBeVisible()
  await expect(todosPage.addButton).toBeVisible()
  await expect(todosPage.todoList).toBeVisible()
})
