import { test, expect } from '../fixtures'

test.describe('Create todo', () => {
  test('creates a todo with title only', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.fillCreateForm('My new task')
    await todosPage.addTodoButton.click()

    await expect(todosPage.todoItem('My new task')).toBeVisible()
  })

  test('creates a todo with all fields', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.fillCreateForm('High priority task', 'Some details here', 'high')
    await todosPage.addTodoButton.click()

    const card = todosPage.todoItem('High priority task')
    await expect(card).toBeVisible()
    await expect(card.getByText('High', { exact: true })).toBeVisible()
    await expect(card.getByText('Some details here')).toBeVisible()
  })

  test('shows validation error for title shorter than 3 chars', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.titleField.fill('ab')
    await todosPage.titleField.blur()

    await expect(todosPage.page.getByText(/at least 3/i)).toBeVisible()
  })

  test('Add Todo button is disabled after entering an invalid title', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.titleField.fill('ab')
    await todosPage.titleField.blur()

    await expect(todosPage.addTodoButton).toBeDisabled()
  })
})

test.describe('Edit todo', () => {
  test('opens edit dialog pre-filled with existing todo values', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.openEditDialog('Learn Playwright')

    await expect(todosPage.dialog.getByPlaceholder('What needs to be done?')).toHaveValue('Learn Playwright')
  })

  test('edits a todo and saves changes', async ({ todosPage }) => {
    await todosPage.goto()
    await todosPage.openEditDialog('Learn Playwright')

    await todosPage.fillEditForm('Learn Playwright (updated)')
    await todosPage.updateTodoButton.click()

    await expect(todosPage.dialog).not.toBeVisible()
    await expect(todosPage.todoItem('Learn Playwright (updated)')).toBeVisible()
    await expect(
      todosPage.page.locator('.MuiCard-root').filter({ hasText: 'Learn Playwright' }).filter({ hasNotText: 'updated' })
    ).not.toBeVisible()
  })
})

test.describe('Delete todo', () => {
  test('deletes a todo', async ({ todosPage }) => {
    await todosPage.goto()
    await expect(todosPage.todoItem('Write smoke test')).toBeVisible()

    await todosPage.deleteButtonOf('Write smoke test').click()

    await expect(todosPage.todoItem('Write smoke test')).not.toBeVisible()
  })
})

test.describe('Toggle completion', () => {
  test('marks an active todo as completed', async ({ todosPage }) => {
    await todosPage.goto()
    const checkbox = todosPage.checkboxOf('Learn Playwright')
    await expect(checkbox).not.toBeChecked()

    await checkbox.click()

    await expect(checkbox).toBeChecked()
  })

  test('marks a completed todo as active', async ({ todosPage }) => {
    await todosPage.goto()
    const checkbox = todosPage.checkboxOf('Wire up CI')
    await expect(checkbox).toBeChecked()

    await checkbox.click()

    await expect(checkbox).not.toBeChecked()
  })
})

test.describe('Filters', () => {
  test('Active filter shows only incomplete todos', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.filterActiveButton.click()

    await expect(todosPage.todoItem('Learn Playwright')).toBeVisible()
    await expect(todosPage.todoItem('Write smoke test')).toBeVisible()
    await expect(todosPage.todoItem('Wire up CI')).not.toBeVisible()
  })

  test('Done filter shows only completed todos', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.filterDoneButton.click()

    await expect(todosPage.todoItem('Wire up CI')).toBeVisible()
    await expect(todosPage.todoItem('Learn Playwright')).not.toBeVisible()
    await expect(todosPage.todoItem('Write smoke test')).not.toBeVisible()
  })

  test('All filter shows all todos after switching away', async ({ todosPage }) => {
    await todosPage.goto()
    await todosPage.filterDoneButton.click()

    await todosPage.filterAllButton.click()

    await expect(todosPage.todoItem('Learn Playwright')).toBeVisible()
    await expect(todosPage.todoItem('Write smoke test')).toBeVisible()
    await expect(todosPage.todoItem('Wire up CI')).toBeVisible()
  })
})

test.describe('Search', () => {
  test('search filters the list by keyword', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.searchInput.fill('Playwright')

    await expect(todosPage.todoItem('Learn Playwright')).toBeVisible()
    await expect(todosPage.todoItem('Write smoke test')).not.toBeVisible()
    await expect(todosPage.todoItem('Wire up CI')).not.toBeVisible()
  })

  test('clearing search restores all todos', async ({ todosPage }) => {
    await todosPage.goto()
    await todosPage.searchInput.fill('Playwright')

    await todosPage.searchInput.fill('')

    await expect(todosPage.todoItem('Learn Playwright')).toBeVisible()
    await expect(todosPage.todoItem('Write smoke test')).toBeVisible()
    await expect(todosPage.todoItem('Wire up CI')).toBeVisible()
  })
})

test.describe('Clear completed', () => {
  test('Clear Completed button appears when completed todos exist', async ({ todosPage }) => {
    await todosPage.goto()

    await expect(todosPage.clearCompletedButton).toBeVisible()
    await expect(todosPage.clearCompletedButton).toContainText('(1)')
  })

  test('Clear Completed removes all completed todos', async ({ todosPage }) => {
    await todosPage.goto()
    await expect(todosPage.todoItem('Wire up CI')).toBeVisible()

    await todosPage.clearCompletedButton.click()

    await expect(todosPage.todoItem('Wire up CI')).not.toBeVisible()
    await expect(todosPage.clearCompletedButton).not.toBeVisible()
  })
})

test.describe('Notifications', () => {
  test('shows success notification after creating a todo', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.fillCreateForm('Notification test todo')
    await todosPage.addTodoButton.click()

    await expect(todosPage.notification).toBeVisible()
    await expect(todosPage.notification).toContainText('Todo created successfully!')
  })

  test('shows success notification after deleting a todo', async ({ todosPage }) => {
    await todosPage.goto()

    await todosPage.deleteButtonOf('Write smoke test').click()

    await expect(todosPage.notification).toBeVisible()
    await expect(todosPage.notification).toContainText('Todo deleted successfully!')
  })
})
