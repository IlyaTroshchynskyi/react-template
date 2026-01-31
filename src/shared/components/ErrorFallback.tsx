import { useState } from 'react'
import { Box, Chip, Alert, Snackbar } from '@mui/material'
import type { FallbackProps } from 'react-error-boundary'

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const [open, setOpen] = useState(true)

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}
        autoHideDuration={3000}
      >
        <Alert
          severity='error'
          onClose={handleClose}
          action={
            <Chip label='Retry' onClick={resetErrorBoundary} color='error' variant='outlined' clickable size='small' />
          }
          sx={{ width: '100%' }}
        >
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </Alert>
      </Snackbar>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Chip label='Click to retry' onClick={resetErrorBoundary} color='error' variant='outlined' clickable />
      </Box>
    </>
  )
}
