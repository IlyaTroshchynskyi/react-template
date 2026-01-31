import { Box, CircularProgress } from '@mui/material'

export const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
    <CircularProgress size={48} />
  </Box>
)
