import { type ReactNode, useMemo } from 'react'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from './store'
import { queryClient } from './queryClient'
import { darkTheme, lightTheme } from './theme'
import { useAppSelector } from './hooks'
import { selectTheme } from '@features/ui/slice/selectors'

interface ProvidersProps {
  children: ReactNode
}

const ThemeWrapper = ({ children }: { children: ReactNode }) => {
  const themeMode = useAppSelector(selectTheme)
  const theme = useMemo(() => (themeMode === 'dark' ? darkTheme : lightTheme), [themeMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export const Providers = ({ children }: ProvidersProps) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeWrapper>{children}</ThemeWrapper>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Provider>
)
