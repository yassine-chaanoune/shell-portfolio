import portfolio from '../data/portfolio.json'
import type { CommandHandler } from './index'

export const funCommand: CommandHandler = () => ({
  output: [
    `Interests: ${portfolio.fun.interests.join(', ')}`,
    `Handle: ${portfolio.fun.username}`,
  ],
  type: 'info',
})

