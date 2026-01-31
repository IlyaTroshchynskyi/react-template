import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useUpdateTodoMutation } from '../queries'
import { createQueryWrapper, resetTodos, todoFactory } from '@test'

// Was left as example maybe for complex queries. in other cases it is useless
describe('todo queries', () => {
  beforeEach(() => {
    resetTodos([])
  })

  describe('useUpdateTodoMutation', () => {
    it('should update an existing todo', async () => {
      const todo = todoFactory.build({ id: '1', title: 'Original' })
      resetTodos([todo])

      const { result } = renderHook(() => useUpdateTodoMutation(), {
        wrapper: createQueryWrapper(),
      })

      const response = await result.current.mutateAsync({ id: '1', title: 'Updated Title' })

      expect(response.title).toBe('Updated Title')
    })
  })
})
