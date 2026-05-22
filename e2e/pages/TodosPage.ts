import { expect, type Locator, type Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class TodosPage extends BasePage {
  readonly heading: Locator
  readonly addButton: Locator
  readonly todoList: Locator

  // Create form
  readonly titleField: Locator
  readonly descriptionField: Locator
  readonly addTodoButton: Locator

  // Edit dialog
  readonly dialog: Locator
  readonly updateTodoButton: Locator
  readonly cancelButton: Locator

  // Filters
  readonly searchInput: Locator
  readonly filterAllButton: Locator
  readonly filterActiveButton: Locator
  readonly filterDoneButton: Locator

  // Other actions
  readonly clearCompletedButton: Locator
  readonly notification: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { level: 1, name: 'Todo App' })
    this.addButton = page.getByRole('button', { name: 'Add Todo' })
    this.todoList = page.locator('.MuiCard-root').first()

    this.titleField = page.getByLabel('Title')
    this.descriptionField = page.getByLabel('Description')
    this.addTodoButton = page.getByRole('button', { name: 'Add Todo' })

    this.dialog = page.getByRole('dialog')
    this.updateTodoButton = page.getByRole('button', { name: 'Update Todo' })
    this.cancelButton = page.getByRole('button', { name: 'Cancel' })

    this.searchInput = page.getByPlaceholder('Search todos...')
    this.filterAllButton = page.getByRole('button', { name: 'All' })
    this.filterActiveButton = page.getByRole('button', { name: 'Active' })
    this.filterDoneButton = page.getByRole('button', { name: 'Done' })

    this.clearCompletedButton = page.getByRole('button', { name: /Clear Completed/ })
    this.notification = page.getByRole('alert')
  }

  async goto() {
    await super.goto('/')
    await expect(this.heading).toBeVisible()
  }

  todoItem(title: string): Locator {
    return this.page.locator('.MuiCard-root').filter({ hasText: title })
  }

  checkboxOf(title: string): Locator {
    return this.todoItem(title).getByRole('checkbox')
  }

  editButtonOf(title: string): Locator {
    return this.todoItem(title).getByRole('button').first()
  }

  deleteButtonOf(title: string): Locator {
    return this.todoItem(title).getByRole('button').last()
  }

  async selectPriority(value: 'low' | 'medium' | 'high', scope?: Locator) {
    const root = scope ?? this.page
    await root.getByRole('combobox', { name: /Priority/ }).click()
    const label = value.charAt(0).toUpperCase() + value.slice(1)
    await this.page.getByRole('listbox').getByRole('option', { name: label }).click()
  }

  async fillCreateForm(title: string, description?: string, priority?: 'low' | 'medium' | 'high') {
    await this.titleField.fill(title)
    if (description !== undefined) {
      await this.descriptionField.fill(description)
    }
    if (priority) {
      await this.selectPriority(priority)
    }
  }

  async openEditDialog(todoTitle: string) {
    await this.editButtonOf(todoTitle).click()
    await expect(this.dialog).toBeVisible()
  }

  async fillEditForm(title: string, description?: string, priority?: 'low' | 'medium' | 'high') {
    const titleInDialog = this.dialog.getByPlaceholder('What needs to be done?')
    await titleInDialog.clear()
    await titleInDialog.fill(title)
    if (description !== undefined) {
      await this.dialog.getByPlaceholder('Add more details...').fill(description)
    }
    if (priority) {
      await this.selectPriority(priority, this.dialog)
    }
  }
}
