import type { ReactNode } from 'react'
import { AppBar, Toolbar, Typography, IconButton, Box, Container, Tooltip, Button } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { toggleTheme } from '@features/ui/slice/uiSlice'
import { selectTheme } from '@features/ui/slice/selectors'
import { FE_ROUTES } from '@shared/constants'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position='sticky'
        elevation={0}
        sx={{
          background: theme => theme.palette.background.paper,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <TaskAltIcon sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography
            variant='h6'
            component='h1'
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: theme =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Todo App
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Button
              variant={location.pathname === FE_ROUTES.HOME ? 'contained' : 'text'}
              size='small'
              onClick={() => navigate(FE_ROUTES.HOME)}
            >
              Todos
            </Button>
            <Button
              variant={location.pathname === FE_ROUTES.SUSPENSE_EXAMPLE ? 'contained' : 'text'}
              size='small'
              onClick={() => navigate(FE_ROUTES.SUSPENSE_EXAMPLE)}
            >
              Suspense
            </Button>
            <Button
              variant={location.pathname === FE_ROUTES.LAZY_EXAMPLE ? 'contained' : 'text'}
              size='small'
              onClick={() => navigate(FE_ROUTES.LAZY_EXAMPLE)}
            >
              Lazy Loading
            </Button>
          </Box>

          <Tooltip title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton
              onClick={() => dispatch(toggleTheme())}
              sx={{
                color: 'text.primary',
              }}
            >
              {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 4,
          background: theme => theme.palette.background.default,
        }}
      >
        <Container maxWidth='md'>{children}</Container>
      </Box>
    </Box>
  )
}
