import { Box, Typography, Paper, Stack, Chip, Alert } from '@mui/material'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SpeedIcon from '@mui/icons-material/Speed'
import CodeIcon from '@mui/icons-material/Code'

const LazyExamplePage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom fontWeight={700}>
        <RocketLaunchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Lazy Loading Example
      </Typography>

      <Alert severity='success' sx={{ mb: 3 }}>
        This page was loaded lazily! It was downloaded only when you navigated here.
      </Alert>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }} variant='outlined'>
          <Typography variant='h6' gutterBottom fontWeight={600}>
            <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            What is Lazy Loading?
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Lazy loading (code splitting) delays loading of route components until they are needed. Instead of
            downloading the entire app upfront, each route becomes a separate JavaScript chunk that loads on-demand.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3 }} variant='outlined'>
          <Typography variant='h6' gutterBottom fontWeight={600}>
            <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            How It Works
          </Typography>
        </Paper>

        <Paper sx={{ p: 3 }} variant='outlined'>
          <Typography variant='h6' gutterBottom fontWeight={600}>
            Benefits
          </Typography>
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            <Chip label='Faster initial load' color='primary' />
            <Chip label='Smaller bundle size' color='primary' />
            <Chip label='Better performance' color='primary' />
            <Chip label='Load on demand' color='primary' />
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}

export default LazyExamplePage
