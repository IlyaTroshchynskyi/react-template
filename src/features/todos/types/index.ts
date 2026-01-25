export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface UpdateTodoDto {
  id: string
  title?: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
}

export type TodoFilter = 'all' | 'active' | 'completed'
export type TodoSortBy = 'createdAt' | 'priority' | 'title'
