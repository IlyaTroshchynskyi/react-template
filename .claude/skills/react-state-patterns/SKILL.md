---
name: react-state-patterns
description: Use when building or modifying components that have tabs, filters, search, or pagination. Use when any UI state needs to survive navigation or be shareable via URL.
---

# React State Patterns

## When to Load This Skill

Load `react-state-patterns` when the task involves any of:
- Tab or view switching inside a page
- Search inputs, filter dropdowns, or sort controls
- Pagination
- Any UI state a user might want to bookmark or share

**Do not load** for pure server-state tasks (API hooks only), form-only components, or simple toggles with no navigation value.

---

## URL State vs. Component State

State that represents a "view" — which tab is active, current filters, current page — belongs in the URL. This makes views shareable, bookmarkable, and preserved on back navigation.

**Rule of thumb:** if the user can copy-paste the URL to return to the same view, the state belongs in the URL.

| State type | Where it lives |
|---|---|
| Active tab / view | `useSearchParams` → named string |
| Search input, filters | `useSearchParams` |
| Page number | `useSearchParams` → `Number(param)` |
| Modal open, tooltip visible | `useState` — transient, not shareable |
| Form field values | `useState` / Formik |
| Server data | React Query — never `useState` |

---

## Tab / View State

**Never use a numeric index. Use named string keys.**

```tsx
// ❌ Never — meaningless in code, git history, and URLs
const [tab, setTab] = useState(0)
```

```tsx
// ✅ Always — self-documenting, shareable URL: ?tab=profile
import { useSearchParams } from 'react-router-dom'

type TabKey = 'profile' | 'users'

const [searchParams, setSearchParams] = useSearchParams()
const tab = (searchParams.get('tab') as TabKey | null) ?? 'profile'

const setTab = (value: TabKey) =>
  setSearchParams(prev => { prev.set('tab', value); return prev })

{tab === 'profile' ? <ProfileTab /> : <UsersTab />}
```

**Why:** `tab === 0` is meaningless in code reviews and git history. `tab === 'profile'` is self-documenting and the URL is shareable.

---

## Filters + Pagination

Filters and page number belong alongside the tab in the URL.

```tsx
// ✅ Read all filter state from URL
const [searchParams, setSearchParams] = useSearchParams()

const search = searchParams.get('search') ?? ''
const role   = (searchParams.get('role') as UserRole | null) ?? ''
const status = (searchParams.get('status') as UserStatus | null) ?? ''
const page   = Number(searchParams.get('page') ?? '0')

// Update a single filter — always reset page
const setFilter = (key: string, value: string) =>
  setSearchParams(prev => {
    if (value) prev.set(key, value)
    else prev.delete(key)
    prev.delete('page')
    return prev
  })

const setPage = (p: number) =>
  setSearchParams(prev => { prev.set('page', String(p)); return prev })

// Clear all filters
const clearFilters = () =>
  setSearchParams(prev => {
    ['search', 'role', 'status', 'page'].forEach(k => prev.delete(k))
    return prev
  })
```

**Resulting URL:** `/users?search=alice&role=admin&page=1`

Debounce the raw search input locally, then write the debounced value to the URL:

```tsx
const [searchInput, setSearchInput] = useState(search)
const debouncedSearch = useDebounce(searchInput, 300)

useEffect(() => {
  setFilter('search', debouncedSearch)
}, [debouncedSearch])
```

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| `useState(0)` for tab index | `useSearchParams` with string key |
| `useState('')` for search that drives filtering | Local `useState` for input + `useEffect` writes debounced value to URL |
| Hardcoded tab index comparisons (`tab === 1`) | Named string comparisons (`tab === 'users'`) |
| Resetting page on filter change inside sort/filter memo | Call `prev.delete('page')` inside the `setFilter` updater |