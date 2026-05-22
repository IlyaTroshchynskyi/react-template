# Plan: E2E Tests for Todo Page

## Context
The todo page has one smoke test (`e2e/tests/smoke.spec.ts`) that only checks the page loads. All user-facing flows — CRUD, filtering, search, clear completed, and notifications — have zero e2e coverage. This plan fills that gap.

## Files to Modify / Create

| File | Action |
|------|--------|
| `e2e/pages/TodosPage.ts` | Extend with locators + helper methods |
| `e2e/tests/todos.spec.ts` | Create — comprehensive test suite |

---

## 1. Expand `TodosPage` POM

Add to `e2e/pages/TodosPage.ts`:

**Locators** (all via role/label/placeholder — no CSS class selectors except card scoping):

```ts
// Create form (always visible)
titleField          = page.getByLabel('Title')
descriptionField    = page.getByLabel('Description')
addTodoButton       = page.getByRole('button', { name: 'Add Todo' })

// Edit dialog (scoped to dialog role)
dialog              = page.getByRole('dialog')
updateTodoButton    = page.getByRole('button', { name: 'Update Todo' })
cancelButton        = page.getByRole('button', { name: 'Cancel' })

// Filters
searchInput         = page.getByPlaceholder('Search todos...')
filterAllButton     = page.getByRole('button', { name: 'All' })
filterActiveButton  = page.getByRole('button', { name: 'Active' })
filterDoneButton    = page.getByRole('button', { name: 'Done' })

// Clear completed
clearCompletedButton = page.getByRole('button', { name: /Clear Completed/ })

// Notification
notification        = page.getByRole('alert')
```

**Card-scoped helpers** (MUI Card renders as `.MuiCard-root`):

```ts
todoItem(title: string): Locator
  → page.locator('.MuiCard-root').filter({ hasText: title })

checkboxOf(title: string): Locator
  → todoItem(title).getByRole('checkbox')

editButtonOf(title: string): Locator
  → todoItem(title).getByRole('button').first()   // Edit is first in Stack

deleteButtonOf(title: string): Locator
  → todoItem(title).getByRole('button').last()    // Delete is last
```

**Priority select helper** — MUI Select needs click-then-pick pattern:

```ts
async selectPriority(value: 'low' | 'medium' | 'high', scope?: Locator)
  → click the Priority combobox within scope (or page), then click the MenuItem
```

MUI Select label uses `id='priority-label'` / `aria-labelledby`; use `getByRole('combobox')` scoped to the form area or dialog.

**Compound action helpers:**

```ts
async fillCreateForm(title: string, description?: string, priority?: 'low'|'medium'|'high')
async fillEditForm(title: string, description?: string, priority?: 'low'|'medium'|'high')
async openEditDialog(todoTitle: string)   // click editButtonOf, wait for dialog
```

---

## 2. `e2e/tests/todos.spec.ts` — Test Groups

All tests use the existing `todosPage` fixture (which auto-activates mock routes and loads 3 seed todos):
- `Learn Playwright` (high, active)
- `Write smoke test` (medium, active)
- `Wire up CI` (low, completed)

### Create todo
- `creates a todo with title only` — fill title, submit, card with that title appears
- `creates a todo with all fields` — title + description + High priority, verify priority chip label "High"
- `shows validation error for title shorter than 3 chars` — type "ab", blur title, error text visible
- `Add Todo button disabled when form is invalid` — on page load (empty title), button is disabled

### Edit todo
- `opens edit dialog pre-filled with existing todo values` — click edit on "Learn Playwright", dialog opens, title field has that value
- `edits a todo and saves changes` — change title to new value, click Update Todo, new title visible, old title gone

### Delete todo
- `deletes a todo` — click delete on "Write smoke test", card disappears

### Toggle completion
- `marks an active todo as completed` — toggle checkbox of "Learn Playwright", verify checkbox becomes checked
- `marks a completed todo as active` — toggle "Wire up CI" checkbox, verify it becomes unchecked

### Filters
- `Active filter shows only incomplete todos` — click Active, "Wire up CI" (completed) not visible; "Learn Playwright" visible
- `Done filter shows only completed todos` — click Done, only "Wire up CI" visible
- `All filter shows all todos` — click Done then All, all 3 todos visible

### Search
- `search filters the list by keyword` — type "Playwright", only "Learn Playwright" visible, others hidden
- `clearing search restores all todos` — after above, clear input, 3 todos visible again

### Clear completed
- `Clear Completed button appears when completed todos exist` — on load, button shows with "(1)"
- `Clear Completed removes all completed todos` — click button, "Wire up CI" gone, button hidden

### Notifications
- `shows success notification after creating a todo` — create todo, alert with "Todo created successfully!" appears
- `shows success notification after deleting a todo` — delete todo, alert with "Todo deleted successfully!" appears

---

## 3. Key Implementation Notes

- **No `test.only`** — playwright.config has `forbidOnly: true` on CI.
- **MUI Select interaction** — for Priority select, click the element then `page.getByRole('option', { name: 'High' }).click()`. Selector may need `listbox` role intermediary; verify during impl.
- **Visibility assertions** — use `toBeVisible()` / `not.toBeVisible()` rather than checking count, so failures report meaningful diffs.
- **Each test is independent** — mock data resets per test automatically (handlers.ts creates a fresh copy of `mockTodos` per `setupMockRoutes` call, and the fixture calls `setupMockRoutes` fresh per test via the page fixture lifecycle).

---

## Verification

```bash
# Run only the new test file
npx playwright test e2e/tests/todos.spec.ts

# Run all e2e tests to check for regressions
npm run test:e2e

# Interactive debugging
npx playwright test --ui e2e/tests/todos.spec.ts
```