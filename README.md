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
npm run dev       # Run both client and JSON Server
npm run client    # Run Vite dev server only
npm run server    # Run JSON Server only
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Environment-specific files:
- `.env.development` - Development settings
- `.env.production` - Production settings

## 🛠️ Code Quality Tools

### ESLint & Prettier

This project uses ESLint for code linting and Prettier for code formatting.

**Prettier Configuration** (`.prettierrc`):
```json
{
  "semi": false,              // No semicolons
  "singleQuote": true,        // Use single quotes
  "tabWidth": 2,              // 2 spaces for indentation
  "trailingComma": "es5",     // Trailing commas where valid in ES5
  "printWidth": 100,          // Max line length 100 characters
  "arrowParens": "avoid",     // Omit parens when possible (x => x)
  "endOfLine": "lf"           // Unix line endings
}
```

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

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [TanStack Query](https://tanstack.com/query)
- [Material-UI](https://mui.com)
- [Formik](https://formik.org)

## 🤝 Contributing

This is a template project. Feel free to use it as a starting point for your applications!

## 📄 License

MIT
