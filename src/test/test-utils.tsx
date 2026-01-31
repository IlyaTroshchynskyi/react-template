/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { uiSlice } from '@features/ui/slice/uiSlice'
import { todosSlice } from '@features/todos/slice/todosSlice'
import { darkTheme, lightTheme } from '@app/theme'

export * from '@testing-library/react'
export { userEvent }

const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  todos: todosSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

// Create a test store with optional preloaded state
export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
  })
}

export type TestStore = ReturnType<typeof createTestStore>

// Create a fresh query client for each test
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

interface WrapperProps {
  children: ReactNode
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
  store?: TestStore
  queryClient?: QueryClient
  routerProps?: MemoryRouterProps
  theme?: 'light' | 'dark'
}

// All-in-one providers wrapper for testing
export const createWrapper = ({
  store = createTestStore(),
  queryClient = createTestQueryClient(),
  routerProps = {},
  theme = 'dark',
}: Partial<ExtendedRenderOptions> = {}) => {
  const selectedTheme = theme === 'dark' ? darkTheme : lightTheme

  return ({ children }: WrapperProps) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>
          <ThemeProvider theme={selectedTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  )
}

// Custom render function with all providers
export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    queryClient = createTestQueryClient(),
    routerProps = {},
    theme = 'dark',
    ...renderOptions
  }: ExtendedRenderOptions = {}
): RenderResult & { store: TestStore; queryClient: QueryClient; user: ReturnType<typeof userEvent.setup> } => {
  const user = userEvent.setup()

  const Wrapper = createWrapper({ store, queryClient, routerProps, theme })

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
    queryClient,
    user,
  }
}

// Wrapper for testing hooks with React Query
export const createQueryWrapper = (queryClient = createTestQueryClient()) => {
  return ({ children }: WrapperProps) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

// Wrapper for testing hooks with Redux
export const createReduxWrapper = (store = createTestStore()) => {
  return ({ children }: WrapperProps) => <Provider store={store}>{children}</Provider>
}

// Wrapper for testing hooks with Router
export const createRouterWrapper = (routerProps: MemoryRouterProps = {}) => {
  return ({ children }: WrapperProps) => <MemoryRouter {...routerProps}>{children}</MemoryRouter>
}

// Combined wrapper for hooks that need multiple providers
export const createHookWrapper = ({
  store = createTestStore(),
  queryClient = createTestQueryClient(),
  routerProps = {},
}: {
  store?: TestStore
  queryClient?: QueryClient
  routerProps?: MemoryRouterProps
} = {}) => {
  return ({ children }: WrapperProps) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  )
}
