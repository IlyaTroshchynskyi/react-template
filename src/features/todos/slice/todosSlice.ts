import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Todo, TodoFilter } from '../types'
import { createTodo } from '../api/todosApi'
import type { TodoFormValues } from '../validation/todoSchema'
/*
 * Just for demonstration
 *
 * */
type CreateTodoInput = TodoFormValues

export interface TodosState {
  items: Todo[]
  selectedFilter: TodoFilter
  loading: {
    fetch: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
  error: string | null
}

const initialState: TodosState = {
  items: [],
  selectedFilter: 'all',
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
}

export const createTodoThunk = createAsyncThunk('todos/create', async (input: CreateTodoInput, { rejectWithValue }) => {
  try {
    return await createTodo(input)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create todo')
  }
})

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.selectedFilter = action.payload
    },
    clearError: state => {
      state.error = null
    },
    optimisticToggle: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(t => t.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    clearTodos: state => {
      state.items = []
    },
  },
  extraReducers: builder => {
    builder.addCase(createTodoThunk.pending, state => {
      state.loading.create = true
      state.error = null
    })
    builder.addCase(createTodoThunk.fulfilled, (state, action) => {
      state.loading.create = false
      state.items.unshift(action.payload)
    })
    builder.addCase(createTodoThunk.rejected, (state, action) => {
      state.loading.create = false
      state.error = action.payload as string
    })
  },
})

export const { setFilter, clearError, optimisticToggle, clearTodos } = todosSlice.actions
