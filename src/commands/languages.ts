import portfolio from '../data/portfolio.json'
import type { CommandHandler } from './index'

export const languagesCommand: CommandHandler = () => ({
  output: portfolio.languages.map((lang) => `${lang.name}: ${lang.level}`),
  type: 'info',
})

