import portfolio from '../data/portfolio.json'
import type { CommandHandler } from './index'

export const aboutCommand: CommandHandler = () => {
  const { identity } = portfolio

  return {
    output: [
      `${identity.name} — ${identity.title}`,
      identity.location,
      identity.challenge,
    ],
    type: 'info',
  }
}

