---
name: react-query-patterns
description: Use when adding data fetching, mutations, polling, or cache invalidation to any feature. Triggers on new API integrations, CRUD operations, or when migrating from useEffect/context-based fetching to TanStack Query.
---

# React Query Patterns

## Overview

This project uses TanStack Query v5 for server state. Every data-fetching feature follows a **two-file pattern** inside the feature's `api/` folder: API functions and query/mutation hooks. The hooks file is the only file with React imports.

## When to Use

- Adding a new API integration to a feature
- Building CRUD operations for a resource
- Adding polling for async job status
- Migrating existing `useEffect`-based fetching to TanStack Query

## File Structure

For a feature called `widgets` under `src/features/widgets/`:

```
src/features/widgets/
├── api/
│   ├── widgetsApi.ts           # Pure async functions (no React)
│   ├── queries.ts              # useQuery/useMutation hooks
│   └── __tests__/
│       └── queries.test.tsx
├── types/
│   └── index.ts                # Response/request types
```

## Step 1: Define Types

Place API response types in `src/features/<name>/types/index.ts`. Use explicit TypeScript interfaces.

```typescript
// src/features/widgets/types/index.ts
export interface Widget {
  id: string;
  name: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateWidgetDto {
  id: string;
  name?: string;
  status?: 'active' | 'archived';
}
```

## Step 2: Write API Functions

Pure TypeScript, zero React imports. Each function calls `axiosInstance` and returns typed data.

```typescript
// src/features/widgets/api/widgetsApi.ts
import { axiosInstance } from '@shared/api';
import { API_ENDPOINTS } from '@shared/constants';
import type { Widget } from '../types';

export const fetchWidgets = async (): Promise<Widget[]> => {
  const { data } = await axiosInstance.get<Widget[]>(API_ENDPOINTS.WIDGETS);
  return data;
};

export const fetchWidgetById = async (id: string): Promise<Widget> => {
  const { data } = await axiosInstance.get<Widget>(`${API_ENDPOINTS.WIDGETS}/${id}`);
  return data;
};

export const createWidget = async (input: Omit<Widget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Widget> => {
  const { data } = await axiosInstance.post<Widget>(API_ENDPOINTS.WIDGETS, input);
  return data;
};

export const patchWidget = async (id: string, updates: Partial<Omit<Widget, 'id'>>): Promise<Widget> => {
  const { data } = await axiosInstance.patch<Widget>(`${API_ENDPOINTS.WIDGETS}/${id}`, updates);
  return data;
};

export const deleteWidget = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.WIDGETS}/${id}`);
};
```

Rules:
- Import `axiosInstance` from `@shared/api` — never create a new Axios instance
- Import endpoint constants from `@shared/constants` — never hardcode URL strings
- Destructure `{ data }` from the response — callers receive the payload directly
- No error handling here — let TanStack Query handle it via `onError`

Add new endpoints to `src/shared/constants/api.ts`:
```typescript
export const API_ENDPOINTS = {
  TODOS: '/todos',
  WIDGETS: '/widgets',  // ← add here
} as const
```

## Step 3: Write Query/Mutation Hooks

Single `queries.ts` file per feature. Exports: key factory, query hooks, mutation hooks.

### Query Key Factory

Always define a key factory object at the top. Keys are hierarchical arrays with `as const`.

```typescript
// src/features/widgets/api/queries.ts
import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { fetchWidgets, fetchWidgetById, createWidget, patchWidget, deleteWidget } from './widgetsApi';
import type { UpdateWidgetDto } from '../types';

export const widgetKeys = {
  all: ['widgets'] as const,
  lists: () => [...widgetKeys.all, 'list'] as const,
  list: (filters: string) => [...widgetKeys.lists(), { filters }] as const,
  details: () => [...widgetKeys.all, 'detail'] as const,
  detail: (id: string) => [...widgetKeys.details(), id] as const,
};
```

Naming: `<feature>Keys` (e.g., `widgetKeys`, `todoKeys`).

### useQuery Hook

```typescript
export const useWidgetsQuery = () =>
  useQuery({
    queryKey: widgetKeys.lists(),
    queryFn: fetchWidgets,
  });

export const useWidgetQuery = (id: string) =>
  useQuery({
    queryKey: widgetKeys.detail(id),
    queryFn: () => fetchWidgetById(id),
    enabled: !!id,
  });
```

- Use `enabled: !!param` when the query depends on a dynamic value that might be empty
- The `queryFn` is a closure capturing parameters — never parse parameters out of the query key

### useQuery with Suspense

Use `useSuspenseQuery` when the parent component is wrapped in `<Suspense>`. Add an artificial delay only for demo purposes.

```typescript
export const useWidgetsSuspenseQuery = () =>
  useSuspenseQuery({
    queryKey: widgetKeys.lists(),
    queryFn: fetchWidgets,
  });
```

### useQuery with Polling

```typescript
const POLL_INTERVAL_MS = 5000;

export const useJobStatusQuery = (jobId: string) =>
  useQuery({
    queryKey: widgetKeys.detail(jobId),
    queryFn: () => fetchWidgetById(jobId),
    enabled: !!jobId,
    refetchInterval: query => {
      const data = query.state.data;
      if (!data) return false;
      return data.status === 'active' ? POLL_INTERVAL_MS : false;
    },
  });
```

- `refetchInterval` receives the query object — inspect `query.state.data` to decide
- Return `false` to stop polling, return milliseconds to continue

### useMutation Hooks

```typescript
export const useCreateWidgetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<Widget, 'id' | 'createdAt' | 'updatedAt'>) => createWidget(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: widgetKeys.lists() });
    },
  });
};

export const useUpdateWidgetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }: UpdateWidgetDto) => patchWidget(id, updates),
    onSuccess: updatedWidget => {
      queryClient.invalidateQueries({ queryKey: widgetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: widgetKeys.detail(updatedWidget.id) });
    },
  });
};

export const useDeleteWidgetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWidget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: widgetKeys.lists() });
    },
  });
};
```

Mutation rules:
- Always invalidate related queries in `onSuccess`
- When you need to invalidate both list and detail, do both in `onSuccess`
- For Axios error discrimination, use `isAxiosError`:

```typescript
import { isAxiosError } from 'axios';

onError: (err: unknown) => {
  if (isAxiosError(err) && err.response && err.response.status < 500) {
    // client error — surface to user
  }
  // server error — surface generic message
},
```

## Step 4: Consume in Components

```typescript
// Queries — destructure data, isLoading, error
const { data: widgets, isLoading, error } = useWidgetsQuery();

// Mutations — use mutateAsync + isPending
const { mutateAsync: createWidget, isPending: isCreating } = useCreateWidgetMutation();

const handleCreate = async (values: FormValues) => {
  await createWidget(values);
};
```

- Use `mutateAsync` (not `mutate`) when you need `await` or `try/finally`
- Use `isPending` for button loading/disabled states
- Always render all three states: loading, error, and data (including empty)

## Quick Reference

| Concern | Pattern |
|---------|---------|
| Key factory naming | `<feature>Keys` with `all`, `lists()`, `list(filters)`, `details()`, `detail(id)` |
| API file | `src/features/<name>/api/<name>Api.ts` — pure TS, no React |
| Hooks file | `src/features/<name>/api/queries.ts` |
| Endpoint constants | `src/shared/constants/api.ts` |
| Axios instance | `axiosInstance` from `@shared/api` |
| Conditional fetch | `enabled: !!paramValue` |
| Polling | `refetchInterval: query => ...` returning `ms` or `false` |
| Cache invalidation | `queryClient.invalidateQueries({ queryKey: keys.lists() })` |
| Error discrimination | `isAxiosError(err)` + check `err.response?.status` |

## Global Configuration

The `QueryClient` at `src/app/queryClient.ts` sets project-wide defaults. Do not override `staleTime`, `gcTime`, or `retry` per-query unless you have a documented reason.

## Testing

- Import from `@test/test-utils` (not `@testing-library/react`) — it re-exports everything plus `renderWithProviders`, `createTestStore`, `createTestQueryClient`
- `renderWithProviders` wraps with Redux, React Query, Router, and MUI theme
- The test `QueryClient` disables retries (`retry: false`) and sets `gcTime: 0`
- Mock API functions at the module level: `vi.mock('@features/widgets/api/widgetsApi')`
- Use MSW handlers for integration-style tests — see `src/test/mocks/` for the pattern (`resetTodos()` / `getTodos()` helpers)
- For polling tests: `vi.useFakeTimers({ shouldAdvanceTime: true })` + `vi.advanceTimersByTimeAsync()`

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Putting React imports in API files | API files are pure TS — only `queries.ts` imports from React/TanStack |
| Using `mutate` when you need `await` | Use `mutateAsync` for async control flow |
| Forgetting `enabled` guard | Always add `enabled: !!id` for queries depending on dynamic params |
| Hardcoding URL strings | Add to `API_ENDPOINTS` in `src/shared/constants/api.ts` |
| Creating a new `axios.create()` | Use the shared `axiosInstance` from `@shared/api` |
| Adding `staleTime`/`gcTime` per query | Use global defaults unless explicitly justified |
| Not invalidating after mutation | Always invalidate related list queries in `onSuccess` |
