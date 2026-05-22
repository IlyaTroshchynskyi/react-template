# React Todo App Template

A modern, production-ready React application template featuring Redux Toolkit, TanStack Query (React Query), Material-UI, and TypeScript.

## 🏗️ Architecture

This project follows a **feature-based architecture** for better scalability and maintainability:

```
src/
├── app/                      # Application configuration
│   ├── store.ts             # Redux store (UI state only)
│   ├── hooks.ts             # Typed Redux hooks
│   ├── queryClient.ts       # React Query configuration
│   ├── theme.ts             # MUI theme (light/dark)
│   └── Providers.tsx        # All context providers
│
├── features/                 # Feature modules
│   ├── todos/
│   │   ├── api/             # API functions + React Query hooks
│   │   │   ├── todosApi.ts  # Pure API functions (Axios)
│   │   │   └── queries.ts   # React Query hooks
│   │   ├── components/      # Feature-specific components
│   │   │   ├── TodoForm.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoList.tsx
│   │   │   └── TodoFilters.tsx
│   │   ├── hooks/           # Feature-specific hooks
│   │   │   └── useTodoFilters.ts  # URL params management
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   │   └── todoUtils.ts # Filtering & sorting (TODO: move to backend)
│   │   └── validation/      # Form validation
│   │       └── todoSchema.ts # Formik + Yup schemas
│   │
│   └── ui/
│       └── slice/           # UI state (theme)
│           ├── uiSlice.ts
│           └── selectors.ts
│
├── shared/                   # Shared across features
│   ├── api/                 # API configuration
│   │   ├── axiosInstance.ts # Axios with interceptors
│   │   ├── tokenService.ts  # Token management
│   │   └── index.ts
│   ├── components/          # Reusable components
│   │   └── Layout.tsx
│   └── constants/           # App-wide constants
│       ├── api.ts           # API endpoints
│       ├── routes.ts        # Route paths
│       └── index.ts
│
├── pages/                    # Route pages
│   └── TodosPage.tsx        # Main todos page
│
├── App.tsx                   # Root component
└── main.tsx                  # Entry point

e2e/                          # Playwright end-to-end tests (see § E2E Tests)
├── fixtures/                 # Custom test + expect (mockRoutes, todosPage)
├── mocks/                    # page.route() handlers + fixture data
├── pages/                    # Page Object Model
└── tests/                    # *.spec.ts files
```

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19.x |
| **TypeScript** | Type safety | 5.9 |
| **Redux Toolkit** | Client state (theme) | Latest |
| **TanStack Query** | Server state & caching | Latest |
| **Material-UI** | UI Components | Latest |
| **Formik + Yup** | Form validation | Latest |
| **React Router** | Routing & URL params | Latest |
| **Axios** | HTTP client with interceptors | Latest |
| **JSON Server** | Mock REST API | Latest |
| **Vite** | Build tool | 7.x |
| **Vitest** | Unit & component tests | 4.x |
| **Playwright** | End-to-end tests | 1.60+ |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Running the Project

The project uses **concurrently** to run both frontend and backend servers:

```bash
# Run both client and server
npm run dev
```

This will start:
- **Vite dev server**: http://localhost:5173 (or next available port)
- **JSON Server API**: http://localhost:3001

### Available Scripts

```bash
npm run dev              # Run both client and JSON Server
npm run client           # Run Vite dev server only
npm run server           # Run JSON Server only
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier write
npm run format:check     # Prettier check
npm run test             # Vitest (watch mode)
npm run test:run         # Vitest single run
npm run test:coverage    # Vitest with coverage (80% threshold)
npm run test:e2e         # Playwright (headless)
npm run test:e2e:ui      # Playwright UI mode
npm run test:e2e:debug   # Playwright debugger
npm run test:e2e:headed  # Playwright headed (visible browser)
```

### 🐳 Docker

```bash
# Build the image
docker build -t react-template .

# Run the container
docker run -p 3000:80 react-template
```

The app will be available at http://localhost:3000

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` in the root:

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:3001
```

## 🛠️ Code Quality Tools

### ESLint & Prettier

This project uses ESLint for code linting and Prettier for code formatting.

**Prettier Configuration** (`.prettierrc`):

**Available commands:**

```bash
npm run lint           # Check for linting errors
npm run lint:fix       # Fix auto-fixable linting errors
npm run format         # Format all files with Prettier
npm run format:check   # Check if files are formatted correctly
```

### IDE Setup

#### **VS Code Setup**

1. **Install recommended extensions** (VS Code will prompt you):
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier - Code formatter (`esbenp.prettier-vscode`)
   - TypeScript Vue Plugin (`ms-vscode.vscode-typescript-next`)

   Or manually: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac), type "Extensions: Show Recommended Extensions"

2. **Settings are already configured** in `.vscode/settings.json`:
   - Format on save is enabled
   - ESLint auto-fix on save
   - Prettier as default formatter

3. **Verify setup**:
   - Open any `.tsx` file
   - Make a formatting mistake (e.g., extra spaces)
   - Save the file - it should auto-format

#### **PyCharm/WebStorm Setup**

1. **Enable ESLint**:
   - Go to `Settings/Preferences` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `ESLint`
   - Check "Automatic ESLint configuration"
   - Check "Run eslint --fix on save"

2. **Enable Prettier**:
   - Go to `Settings/Preferences` → `Languages & Frameworks` → `JavaScript` → `Prettier`
   - Set Prettier package: `{project_root}/node_modules/prettier`
   - Check "On save" under "Run for files"
   - Set glob pattern: `{**/*,*}.{js,ts,jsx,tsx,json,css}`

3. **Configure File Watchers** (Optional - for auto-format):
   - Go to `Settings/Preferences` → `Tools` → `File Watchers`
   - Click `+` → `Prettier`
   - File type: `TypeScript JSX`
   - Scope: `Project Files`
   - Program: `$ProjectFileDir$/node_modules/.bin/prettier`
   - Arguments: `--write $FilePathRelativeToProjectRoot$`
   - Output paths: `$FilePathRelativeToProjectRoot$`
   - Check "Auto-save edited files to trigger the watcher"

4. **Enable TypeScript Service**:
   - Go to `Settings/Preferences` → `Languages & Frameworks` → `TypeScript`
   - Check "Use TypeScript Service"
   - TypeScript: Use version from `node_modules`

5. **Verify setup**:
   - Open any `.tsx` file
   - You should see ESLint warnings/errors highlighted
   - Press `Ctrl+Alt+L` (or `Cmd+Option+L` on Mac) to format
   - Or save the file to auto-format

#### **Troubleshooting**

**VS Code:**
- If formatting doesn't work: Press `Ctrl+Shift+P`, type "Developer: Reload Window"
- Check Output panel: Select "ESLint" or "Prettier" from dropdown

**PyCharm/WebStorm:**
- If ESLint doesn't work: Try "Restart ESLint Service" in the ESLint settings
- If Prettier doesn't work: Check the Prettier package path is correct
- View errors: `View` → `Tool Windows` → `Problems`

### Pre-commit Hooks (Husky + lint-staged)

This project uses **Husky** for Git hooks and **lint-staged** to run linters on staged files before each commit.

#### Setup

1. **Initialize Husky** (run once after cloning):

```bash
npm run prepare
```

This creates the `.husky/` directory.

2. **Add pre-commit hook** (Husky v9+):

```bash
echo "npx lint-staged" > .husky/pre-commit
```

That's it! No need to make it executable in Husky v9+.

#### How It Works

When you run `git commit`, the pre-commit hook automatically:

1. Runs **Prettier** to format staged files
2. Runs **ESLint** with `--fix` on staged files
3. If there are errors that can't be auto-fixed, the commit is **blocked**
```

#### Testing the Hook

```bash
# Make a change to a .tsx file
echo "const x=1" >> src/App.tsx

# Stage and commit
git add src/App.tsx
git commit -m "test commit"

# The hook will format the code before committing
```

#### Bypassing Hooks (Emergency Only)

```bash
git commit -m "message" --no-verify
```

⚠️ Use sparingly — this skips all quality checks!

## 🎭 End-to-End Tests (Playwright)

End-to-end tests live in `e2e/` and run real browser sessions against the Vite dev server. The setup is isolated from the unit-test stack (Vitest) and uses a separate TypeScript config so Playwright types stay out of the production build.

### How it works

API calls are intercepted at the browser network level using `page.route()`. **No mock backend (json-server) is required** to run the tests — fixture data is served entirely from Playwright. The same setup transparently supports a real backend by setting `USE_REAL_BACKEND=true`, which bypasses the mocks and forwards requests.

**Why route mocking over json-server?** `page.route()` handles file uploads, long polling, SSE, and WebSockets (via `page.routeWebSocket()`). It also keeps fixture data co-located with the tests and removes the need for a running mock server.

### Folder structure

```
e2e/
├── fixtures/
│   └── index.ts          # Custom test + expect, exports mockRoutes + todosPage fixtures
├── mocks/
│   ├── handlers.ts       # setupMockRoutes(page) — registers page.route() handlers
│   └── data/
│       └── todos.ts      # Static fixture data typed against the app's Todo interface
├── pages/
│   ├── BasePage.ts       # Shared goto()
│   └── TodosPage.ts      # POM for the Todos route (/)
└── tests/
    └── smoke.spec.ts     # Smoke test: app loads, todos page is visible

playwright.config.ts       # Chromium project, dotenv loading, Vite webServer
tsconfig.e2e.json          # Isolated TS config — Playwright types do NOT leak into Vite build
.env.e2e                   # Committed defaults (USE_REAL_BACKEND=false)
.env.e2e.local             # Local overrides (gitignored via *.local)
.github/workflows/playwright.yml
```

### Type-safety guarantee

Mock data imports the production `Todo` type directly from `@features/todos/types`. If `Todo` gains or loses a field, `mockTodos` fails to compile — schema drift is impossible.

### Running tests

```bash
# Run all E2E tests headless (default)
npm run test:e2e

# Run a single spec file
npx playwright test e2e/tests/smoke.spec.ts

# Filter by test title
npx playwright test -g "app loads"

# Interactive UI mode — best for development
npm run test:e2e:ui

# Headed mode (watch the browser)
npm run test:e2e:headed

# Step-through debugger
npm run test:e2e:debug
```

Playwright auto-starts Vite via the `webServer` config option — you do **not** need to run `npm run dev` first. If Vite is already running on `:5173`, Playwright reuses it (`reuseExistingServer: !CI`).

### Reports & artifacts

| Artifact | When generated | Location |
|---|---|---|
| HTML report | Every run | `playwright-report/` (auto-opens on failure locally) |
| Trace | On first retry | `test-results/<test>/trace.zip` |
| Screenshot | On failure | `test-results/<test>/test-failed-N.png` |
| Video | On failure | `test-results/<test>/video.webm` |

View the last report:

```bash
npx playwright show-report
```

Open a trace file:

```bash
npx playwright show-trace test-results/<test>/trace.zip
```

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `USE_REAL_BACKEND` | `false` | When `'true'`, mocks are skipped and requests hit the real backend |
| `API_URL` | `http://localhost:3001` | Base URL of the real/mock backend (used by mock handlers and the app) |
| `CI` | unset | When set, activates strict mode: `forbidOnly`, 2 retries, 50% workers, github reporter |

`playwright.config.ts` loads `.env.e2e.local` first, then `.env.e2e` — local values win (dotenv does not override existing keys).

### Running against a real backend

```bash
# 1. Start your backend manually (json-server, FastAPI, etc.) on port 3001
npm run server   # or: uvicorn app.main:app --port 3001

# 2. Create .env.e2e.local with:
#    USE_REAL_BACKEND=true
#    API_URL=http://localhost:3001

# 3. Run the tests — mocks are bypassed
npm run test:e2e
```

> Playwright's `webServer` only starts Vite. When `USE_REAL_BACKEND=true`, **you are responsible for starting the backend** before running tests.

### Writing a new test

Tests use a **Page Object Model** with **custom fixtures**. The fixture chain automatically applies mock routes before any page object is instantiated — tests never call `setupMockRoutes` directly.

**1. Add a page object** (`e2e/pages/MyPage.ts`):

```typescript
import { expect, type Locator, type Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class MyPage extends BasePage {
  readonly heading: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { level: 1, name: 'My Page' })
    this.submitButton = page.getByRole('button', { name: 'Submit' })
  }

  async goto() {
    await super.goto('/my-route')
    await expect(this.heading).toBeVisible()
  }
}
```

**2. Wire it into the fixtures** (`e2e/fixtures/index.ts`):

```typescript
interface Fixtures {
  mockRoutes: void
  todosPage: TodosPage
  myPage: MyPage  // ← add
}

export const test = base.extend<Fixtures>({
  // ...existing fixtures
  myPage: async ({ page, mockRoutes: _mockRoutes }, use) => {
    await use(new MyPage(page))
  },
})
```

The unused `mockRoutes` dependency ensures mocks are set up before the page object is created.

**3. Write the spec** (`e2e/tests/my-feature.spec.ts`):

```typescript
import { test, expect } from '../fixtures'

test('submits the form', async ({ myPage }) => {
  await myPage.goto()
  await myPage.submitButton.click()
  await expect(myPage.heading).toContainText('Success')
})
```

### Adding mock routes for new endpoints

Edit `e2e/mocks/handlers.ts` and register additional `page.route()` calls inside `setupMockRoutes`. Match by absolute URL (`${API_BASE}/endpoint`) or regex for parameterized paths. Always call `route.fallback()` for unhandled methods so they pass through (useful in real-backend mode).

### Locator conventions

- Prefer **role-based locators** (`getByRole`, `getByLabel`, `getByText`) over CSS selectors — they reflect the accessibility tree and survive markup changes.
- Avoid `page.waitForLoadState('networkidle')` — it is unreliable with React Query background refetches, polling, and SSE. Wait on a concrete locator instead (`await expect(locator).toBeVisible()`).
- Define locators as **readonly class fields** in the page object constructor so they are created once.

### CI

GitHub Actions runs the suite on every push and PR to `main`/`master` via `.github/workflows/playwright.yml`:

- 30-minute timeout
- Installs Chromium only (`npx playwright install chromium --with-deps`)
- Uploads `playwright-report/` as an artifact (14-day retention) on every run, including failures

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ReferenceError: __dirname is not defined` | ESM project missing `__dirname` shim in `playwright.config.ts` | Already handled — uses `fileURLToPath(import.meta.url)` |
| Tests hit the real backend unexpectedly | `USE_REAL_BACKEND` set to truthy string in env | Verify `.env.e2e.local` — only `'true'` skips mocks (the string `'false'` is also truthy in JS) |
| Vite port `:5173` busy | Another dev server running | Either stop it, or rely on `reuseExistingServer: !CI` (already enabled locally) |
| ESLint errors about `use` being a React hook in fixtures | `react-hooks/rules-of-hooks` rule false-positives on Playwright's `use` callback | Already handled — disabled for `e2e/**` in `eslint.config.js` |
| Mock fixture types out of sync with app | Mocks no longer match the `Todo` type | TypeScript will fail — update `e2e/mocks/data/todos.ts` |

## 🔧 Configuration (Original)

## 📦 Key Features

### 1. **State Management Pattern**

- **Redux** → Client state only (theme, UI preferences)
- **React Query** → Server state (data fetching, caching, mutations)
- **URL Params** → Filters and sorting (shareable URLs)

### 2. **API Layer**

```typescript
// Pure API functions (todosApi.ts)
export const fetchTodos = async (): Promise<Todo[]> => { ... }
export const createTodo = async (input: TodoFormValues): Promise<Todo> => { ... }

// React Query hooks (queries.ts)
export const useTodosQuery = () => useQuery({ ... })
export const useCreateTodoMutation = () => useMutation({ ... })
```

### 3. **Axios Interceptors**

- **Request interceptor**: Adds `Authorization` header
- **Response interceptor**: Handles 401, refreshes tokens, retries requests

### 4. **Form Validation**

Using Formik + Yup with Material-UI:

```typescript
const todoValidationSchema = Yup.object({
  title: Yup.string().required('Title is required').min(3).max(100),
  description: Yup.string().max(500),
  priority: Yup.string().oneOf(['low', 'medium', 'high']).required(),
})
```

### 5. **URL-Based Filters**

Filters stored in URL for sharable links:
```
/?filter=active&sortBy=priority&search=react
```

## 📝 Important Notes

### Client-Side Filtering (TODO)

Currently, filtering and sorting happen on the client. See `todoUtils.ts` for details.

**⚠️ In production**, this should be done on the backend:
```typescript
// Backend should handle:
GET /todos?status=active&sortBy=priority&order=desc&search=react&page=1&limit=20
```

### Mock API

The project uses **JSON Server** for a mock REST API. Replace with your real backend:

1. Update `VITE_API_BASE_URL` in `.env`
2. Adjust API functions in `todosApi.ts` if needed
3. Update response types if backend structure differs

## 🏗️ Best Practices Used

✅ **Feature-based architecture** - Scalable and maintainable
✅ **Single Responsibility** - Each module has one purpose
✅ **Custom hooks** - Reusable logic extraction
✅ **Memoization** - Performance optimization
✅ **Type safety** - Full TypeScript coverage
✅ **Separation of concerns** - API / State / UI layers
✅ **Named exports** - Better tree-shaking
✅ **Arrow functions** - Consistent code style

## 🤖 Claude Code

The Claude Code configuration is committed to this repository under `.claude/` for reference:

- **`CLAUDE.md`** — project context loaded automatically by Claude Code (commands, architecture, testing patterns)
- **`.claude/skills/`** — reusable skill prompts: `route-builder`, `react-query-patterns`, `security-pr-checklist`, `vercel-composition-patterns`, `vercel-react-best-practices`
- **`.claude/agents/`** — specialized sub-agents: `senior-dev` (feature implementation) and `senior-qa` (bug hunting + testing)

## 🤝 Contributing

This is a template project. Feel free to use it as a starting point for your applications!

## 📄 License

MIT
