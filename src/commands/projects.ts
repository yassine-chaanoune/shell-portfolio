import portfolio from '../data/portfolio.json'
import type { CommandHandler } from './index'

export const projectsCommand: CommandHandler = () => ({
  output: portfolio.projects.map(
    (project) =>
      `${project.name}: ${project.description} [${project.stack.join(', ')}]${
        project.url ? ` ${project.url}` : ''
      }`,
  ),
  type: 'info',
})

