import portfolio from '../data/portfolio.json'
import type { CommandHandler } from './index'

export const experienceCommand: CommandHandler = () => ({
  output: portfolio.experience.map((item) => {
    const base = `${item.company} — ${item.role} (${item.type ?? 'Full-time'}) ${item.period}`
    const stack = `Stack: ${item.stack.join(', ')}`
    const tasks = item.tasks.map((task) => `• ${task}`).join(' | ')
    return `${base} | ${stack} | ${tasks}`
  }),
  type: 'info',
})

