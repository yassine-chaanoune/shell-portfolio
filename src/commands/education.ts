import portfolio from '../data/portfolio.json'
import type { CommandHandler } from './index'

export const educationCommand: CommandHandler = () => ({
  output: portfolio.education.map(
    (item) => `${item.period} — ${item.institution}: ${item.degree}`,
  ),
  type: 'info',
})

