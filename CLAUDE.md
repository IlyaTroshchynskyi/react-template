# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start both Vite dev server (port 5173) and json-server mock API (port 3001)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check

npm run test         # Vitest in watch mode
npm run test:run     # Vitest single run
npm run test:coverage # Run with coverage (80% threshold enforced)
npm run test:ui      # Vitest UI
```

To run a single test file:
```bash
npx vitest run src/features/todos/slice/__tests__/todosSlice.test.ts
```

## Architecture

**Path aliases** (defined in both `vite.config.ts` and `vitest.config.ts`):
- `@` → `src` (bare alias; prefer the named aliases below)
- `@app` → `src/app`
- `@features` → `src/features`
- `@shared` → `src/shared`
- `@pages` → `src/pages`
- `@test` → `src/test`

**State management — dual pattern by design:**
The app deliberately demonstrates both Redux Toolkit and React Query side-by-side for the same todos domain. React Query is the primary data-fetching layer (`src/features/todos/api/queries.ts`); the Redux `todosSlice` is used for client-side state (filter, optimistic updates) and as a demonstration of `createAsyncThunk`. New features should follow this same split: server state via React Query, UI/client state via Redux.

**Directory layout:**
- `src/app/` — Redux store, React Query client, MUI theme, typed hooks, `Providers.tsx` (wraps the whole app)
- `src/features/<name>/` — feature modules containing `api/`, `components/`, `hooks/`, `slice/`, `types/`, `utils/`, `validation/`
- `src/shared/` — reusable across features: `api/axiosInstance.ts` (with token refresh interceptor), `constants/`, `components/`
- `src/pages/` — route-level components; lazy-loaded pages use `React.lazy` + `<Suspense>`
- `src/test/` — shared test infrastructure (not feature tests)

**Routing:** `react-router-dom` v7. Routes defined in `src/App.tsx`. Route constants in `src/shared/constants/routes.ts`. Unknown routes redirect to `NotFoundPage`.

**HTTP client:** `src/shared/api/axiosInstance.ts` — Axios instance with Bearer token injection and automatic token refresh on 401 (queue pattern). Base URL comes from `VITE_API_BASE_URL` env var (see `.env.example`); defaults to `http://localhost:3001` in development via `src/shared/constants/api.ts`.

**Mock backend:** `json-server` watching `db.json` on port 3001. Sufficient for local development without a real backend.

## Testing

All tests co-locate inside `__tests__/` folders next to the code they test, except shared infrastructure under `src/test/`.

**Test utilities** (`src/test/test-utils.tsx`) — always import from here instead of `@testing-library/react`:
- `renderWithProviders(ui, options)` — renders with Redux, React Query, Router, and MUI theme
- `createTestStore(preloadedState?)` — isolated Redux store for a test
- `createTestQueryClient()` — React Query client with retries disabled
- `createWrapper / createQueryWrapper / createReduxWrapper / createRouterWrapper / createHookWrapper` — composable wrappers for `renderHook`

**API mocking:** MSW v2 (`src/test/mocks/`). The server is started globally in `src/test/setup.ts`. Handlers maintain an in-memory `todos` array; call `resetTodos()` in `beforeEach` to isolate tests. `errorHandlers` exports named handlers for overriding happy-path responses with errors via `server.use(...)`.

**Factories:** `src/test/factories/todoFactory.ts` uses Fishery + Faker. Use `todoFactory.build(overrides)` or `todoFactory.buildList(n)` to generate typed fixture data.

## Pre-commit hooks

Husky runs `lint-staged` on commit: Prettier + ESLint auto-fix for all `src/**/*.{ts,tsx,css,json}` files.
