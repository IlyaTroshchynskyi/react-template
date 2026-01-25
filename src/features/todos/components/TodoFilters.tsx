import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  InputAdornment,
  Paper,
  Typography,
  Chip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import type { TodoFilter, TodoSortBy } from '../types'

interface TodoFiltersProps {
  filter: TodoFilter
  sortBy: TodoSortBy
  searchQuery: string
  stats: {
    total: number
    completed: number
    active: number
  }
  onFilterChange: (filter: TodoFilter) => void
  onSortChange: (sortBy: TodoSortBy) => void
  onSearchChange: (query: string) => void
}

export const TodoFilters = ({
  filter,
  sortBy,
  searchQuery,
  stats,
  onFilterChange,
  onSortChange,
  onSearchChange,
}: TodoFiltersProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      border: 1,
      borderColor: 'divider',
      borderRadius: 3,
    }}
  >
    <Stack spacing={2}>
      {/* Stats */}
      <Stack direction='row' spacing={1.5} flexWrap='wrap' useFlexGap>
        <Chip label={`Total: ${stats.total}`} variant='outlined' size='small' />
        <Chip label={`Active: ${stats.active}`} color='primary' variant='outlined' size='small' />
        <Chip label={`Completed: ${stats.completed}`} color='success' variant='outlined' size='small' />
      </Stack>

      {/* Search */}
      <TextField
        fullWidth
        size='small'
        placeholder='Search todos...'
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon color='action' />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Filters and Sort */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color='action' fontSize='small' />
          <Typography variant='body2' color='text.secondary'>
            Filter:
          </Typography>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, value) => value && onFilterChange(value)}
            size='small'
          >
            <ToggleButton value='all'>All</ToggleButton>
            <ToggleButton value='active'>Active</ToggleButton>
            <ToggleButton value='completed'>Done</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <FormControl size='small' sx={{ minWidth: 150 }}>
          <InputLabel id='sort-label'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SortIcon fontSize='small' />
              Sort By
            </Box>
          </InputLabel>
          <Select
            labelId='sort-label'
            value={sortBy}
            label='Sort By'
            onChange={e => onSortChange(e.target.value as TodoSortBy)}
          >
            <MenuItem value='createdAt'>Date Created</MenuItem>
            <MenuItem value='priority'>Priority</MenuItem>
            <MenuItem value='title'>Title</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  </Paper>
)
