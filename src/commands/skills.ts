import portfolio from '../data/portfolio.json'
import type { CommandHandler } from './index'

export const skillsCommand: CommandHandler = () => {
  const { skills } = portfolio

  return {
    output: [
      `Frontend: ${skills.frontend.join(', ')}`,
      `Backend: ${skills.backend.join(', ')}`,
      `Databases: ${skills.databases.join(', ')}`,
      `Tools: ${skills.tools.join(', ')}`,
      `Soft skills: ${skills.softSkills.join(', ')}`,
    ],
    type: 'info',
  }
}

