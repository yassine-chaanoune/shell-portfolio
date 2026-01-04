import portfolio from '../data/portfolio.json'
import type { CommandHandler } from './index'

export const contactCommand: CommandHandler = () => {
  const { contact } = portfolio

  return {
    output: [
      `Email: ${contact.email}`,
      `Phone: ${contact.phone}`,
      `GitHub: ${contact.github}`,
      `LinkedIn: ${contact.linkedin}`,
      `WhatsApp: ${contact.whatsapp}`,
    ],
    type: 'info',
  }
}

