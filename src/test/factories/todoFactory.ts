import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import type { Todo } from '@features/todos/types'

export const todoFactory = Factory.define<Todo>(({ sequence }) => {
  const createdAt = faker.date.past({ years: 1 })
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() })

  return {
    id: String(sequence),
    title: faker.lorem.sentence({ min: 3, max: 8 }).slice(0, -1), // Remove trailing period
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    completed: false,
    priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  }
})
