---
name: route-builder
description: Use when adding a new page, route, or feature area to the app. Triggers on new routes, new feature folders, page scaffolding, or when asked to build a complete feature with components, services, and tests.
---

# Route Builder

## Overview

This project uses **JSX-based routing** with React Router v7. Routes are defined directly in `src/App.tsx`. Pages live in `src/pages/`, features in `src/features/`. All data fetching is client-side — no SSR, no loaders.

## When to Use

- Adding a new page or route to the app
- Scaffolding a complete feature area (components, API hooks, Redux slice, types, tests)
- Moving inline logic into the correct folder structure

## Build Order

Follow this exact sequence when creating a new route:

### 1. Add the Route Constant

Add the path to `src/shared/constants/routes.ts` **first**.

```typescript
// src/shared/constants/routes.ts
export const FE_ROUTES = {
  HOME: '/',
  TODOS: '/',
  WIDGETS: '/widgets',           // ← add here
  WIDGET_DETAIL: '/widgets/:id', // ← dynamic example
  NOT_FOUND: '/not-found',
} as const
```

### 2. Register the Route in App.tsx

Add the `<Route>` to `src/App.tsx`. Unknown paths already fall through to `<Navigate to={FE_ROUTES.NOT_FOUND} />`.

```tsx
// src/App.tsx
import { WidgetsPage } from '@pages/WidgetsPage'

// Inside <Routes>:
<Route path={FE_ROUTES.WIDGETS} element={<WidgetsPage />} />
```

For lazy-loaded pages:
```tsx
const LazyWidgetsPage = lazy(() => import('@pages/WidgetsPage'))

<Route
  path={FE_ROUTES.WIDGETS}
  element={
    <Suspense fallback={<LoadingFallback />}>
      <LazyWidgetsPage />
    </Suspense>
  }
/>
```

Use lazy loading for pages that are not on the critical first-load path.

### 3. Create the Page Component

```
src/pages/WidgetsPage.tsx
```

Named export. Owns layout, calls feature hooks, delegates rendering to feature components.

```tsx
// src/pages/WidgetsPage.tsx
import { Container, Stack, Typography } from '@mui/material'
import { WidgetList } from '@features/widgets/components'
import { useWidgetsQuery } from '@features/widgets/api/queries'

export const WidgetsPage = () => {
  const { data: widgets, isLoading, error } = useWidgetsQuery()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Widgets</Typography>
        <WidgetList items={widgets} isLoading={isLoading} error={error} />
      </Stack>
    </Container>
  )
}
```

### 4. Create the Feature Folder

```
src/features/widgets/
├── api/
│   ├── widgetsApi.ts           # Pure async functions (no React)
│   ├── queries.ts              # TanStack Query hooks + key factory
│   └── __tests__/
│       └── queries.test.tsx
├── components/
│   ├── index.ts                # Barrel export
│   ├── WidgetList.tsx
│   ├── WidgetItem.tsx
│   └── __tests__/
│       ├── WidgetList.test.tsx
│       └── WidgetItem.test.tsx
├── hooks/
│   └── useWidgetFilters.ts     # Client-side derived state (optional)
├── slice/
│   ├── widgetsSlice.ts         # Redux slice for client-only UI state
│   ├── selectors.ts
│   └── __tests__/
│       └── widgetsSlice.test.ts
├── types/
│   └── index.ts
├── utils/
│   └── widgetUtils.ts          # Pure transformation functions
└── validation/
    └── widgetSchema.ts         # Yup schema for forms
```

Scale down for simple routes — a read-only display feature may only need `api/` and `components/`.

### 5. Write Feature Components

Each component: explicit props interface, handles loading/error/empty states, MUI `sx` for styling.

```tsx
// src/features/widgets/components/WidgetItem.tsx
import { Card, CardContent, Typography, Chip } from '@mui/material'
import type { Widget } from '../types'

interface WidgetItemProps {
  widget: Widget
  onSelect?: (id: string) => void
}

export const WidgetItem = ({ widget, onSelect }: WidgetItemProps) => (
  <Card
    onClick={() => onSelect?.(widget.id)}
    sx={{ cursor: onSelect ? 'pointer' : 'default' }}
  >
    <CardContent>
      <Typography variant="subtitle1">{widget.name}</Typography>
      <Chip label={widget.status} size="small" />
    </CardContent>
  </Card>
)
```

Barrel-export from `src/features/widgets/components/index.ts`:
```typescript
export { WidgetList } from './WidgetList'
export { WidgetItem } from './WidgetItem'
```

### 6. Wire Up Redux (if client-side state needed)

Add the slice reducer to `src/app/store.ts`:

```typescript
import { widgetsSlice } from '@features/widgets/slice/widgetsSlice'

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    todos: todosSlice.reducer,
    widgets: widgetsSlice.reducer,  // ← add here
  },
})
```

Use Redux for UI state (filters, selections, pagination) and `createAsyncThunk` only when you need side-effects beyond what TanStack Query handles. Server state belongs in React Query.

### 7. Write API Layer

Follow the `react-query-patterns` skill for the full pattern. Summary:
1. `types/index.ts` — TypeScript interfaces for API responses
2. `api/widgetsApi.ts` — pure async functions using `axiosInstance` from `@shared/api`
3. `api/queries.ts` — TanStack Query hooks with `widgetKeys` factory

### 8. Write Form Validation (if forms needed)

```typescript
// src/features/widgets/validation/widgetSchema.ts
import * as yup from 'yup'

export const widgetSchema = yup.object({
  name: yup.string().required('Name is required').max(100),
  status: yup.mixed<'active' | 'archived'>().oneOf(['active', 'archived']).required(),
})

export type WidgetFormValues = yup.InferType<typeof widgetSchema>
```

Use with Formik:
```tsx
import { useFormik } from 'formik'
const formik = useFormik({ validationSchema: widgetSchema, ... })
```

### 9. Write Tests

```tsx
// src/features/widgets/components/__tests__/WidgetItem.test.tsx
import { screen } from '@test/test-utils'
import { renderWithProviders } from '@test/test-utils'
import userEvent from '@testing-library/user-event'
import { WidgetItem } from '../WidgetItem'
import { widgetFactory } from '@test/factories'

describe('WidgetItem', () => {
  it('renders widget name', () => {
    const widget = widgetFactory.build()
    renderWithProviders(<WidgetItem widget={widget} />)
    expect(screen.getByText(widget.name)).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup()
    const widget = widgetFactory.build()
    const onSelect = vi.fn()
    renderWithProviders(<WidgetItem widget={widget} onSelect={onSelect} />)
    await user.click(screen.getByText(widget.name))
    expect(onSelect).toHaveBeenCalledWith(widget.id)
  })
})
```

For factories, add to `src/test/factories/`:
```typescript
// src/test/factories/widgetFactory.ts
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import type { Widget } from '@features/widgets/types'

export const widgetFactory = Factory.define<Widget>(({ sequence }) => ({
  id: String(sequence),
  name: faker.lorem.words(3),
  status: faker.helpers.arrayElement(['active', 'archived'] as const),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}))
```

Export from `src/test/factories/index.ts`.

Run a single test file:
```bash
npx vitest run src/features/widgets/components/__tests__/WidgetItem.test.tsx
```

Run coverage scoped to the new feature:
```bash
npx vitest run --coverage src/features/widgets/
```

## Quick Reference

| What | Where |
|------|-------|
| Route constants | `src/shared/constants/routes.ts` — add here FIRST |
| Route registration | `src/App.tsx` — add `<Route>` inside `<Routes>` |
| Page component | `src/pages/<PageName>.tsx` — named export |
| Feature components | `src/features/<name>/components/` |
| Shared components (2+ features) | `src/shared/components/` |
| API types | `src/features/<name>/types/index.ts` |
| API functions | `src/features/<name>/api/<name>Api.ts` |
| Query hooks | `src/features/<name>/api/queries.ts` |
| Redux slice | `src/features/<name>/slice/<name>Slice.ts` |
| Selectors | `src/features/<name>/slice/selectors.ts` |
| Form validation | `src/features/<name>/validation/<name>Schema.ts` |
| API endpoint constants | `src/shared/constants/api.ts` |
| Tests | `__tests__/` folder next to source (plural, double underscore) |
| Test utilities | `@test/test-utils` — `renderWithProviders`, `createTestStore` |
| Test factories | `src/test/factories/` |
| MSW handlers | `src/test/mocks/handlers.ts` |

## Component Placement Rules

```
Used by 2+ features or pages?
  YES → src/shared/components/
  NO  → src/features/<name>/components/

Page-level orchestration component?
  YES → src/pages/

Layout chrome (nav, sidebar, footer)?
  YES → src/shared/components/Layout.tsx
```

## Styling Rules

- Use MUI component props and `sx` prop — no `style={{}}` objects, no raw CSS files (except `index.css` for globals)
- Use theme tokens (`theme.palette`, `theme.spacing`) — no hardcoded hex values
- Dark/light theme is managed via Redux `uiSlice` → `selectTheme` selector; `Providers.tsx` reads it
- For custom styled components, use MUI `styled()` from `@mui/material/styles`

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Adding a route without the constant | Always add to `FE_ROUTES` in `routes.ts` first |
| Hardcoding route paths as strings | Use `FE_ROUTES.<NAME>` everywhere |
| Putting business logic in page components | Extract to feature `api/` or `utils/` |
| Using `useEffect` to fetch data | Use TanStack Query hooks from `api/queries.ts` |
| Creating a new Axios instance | Import `axiosInstance` from `@shared/api` |
| Using `fireEvent` in tests | Use `userEvent` from `@testing-library/user-event` |
| Using `__test__` (singular) | Use `__tests__` (plural) to match project convention |
| Mixing server state into Redux | Server state belongs in TanStack Query, not Redux slices |
| Not adding slice to `store.ts` | Redux slice is dead until registered in `src/app/store.ts` |
