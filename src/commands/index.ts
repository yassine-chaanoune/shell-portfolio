import { aboutCommand } from './about'
import { contactCommand } from './contact'
import { educationCommand } from './education'
import { experienceCommand } from './experience'
import { funCommand } from './fun'
import { helpCommand } from './help'
import { languagesCommand } from './languages'
import { messageCommand } from './message'
import { projectsCommand } from './projects'
import { skillsCommand } from './skills'

export type CommandResponse = {
  output: string | string[]
  type?: 'info' | 'error'
}

export type CommandHandler = (args: string[]) => CommandResponse

const commands: Record<string, CommandHandler> = {
  help: helpCommand,
  about: aboutCommand,
  projects: projectsCommand,
  skills: skillsCommand,
  experience: experienceCommand,
  education: educationCommand,
  languages: languagesCommand,
  contact: contactCommand,
  fun: funCommand,
  message: messageCommand,
}

export const availableCommands = Object.keys(commands)

const levenshtein = (a: string, b: string) => {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0),
  )

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
  }

  return dp[a.length][b.length]
}

const suggestCommand = (name: string) => {
  const normalized = name.toLowerCase()
  const candidates = availableCommands
    .map((cmd) => ({ cmd, distance: levenshtein(normalized, cmd) }))
    .sort((a, b) => a.distance - b.distance)

  const best = candidates[0]
  if (!best) return null

  // small threshold: exact prefix or distance <= 2
  if (best.distance === 0) return null
  if (normalized.startsWith(best.cmd.slice(0, 2)) || best.cmd.startsWith(normalized)) return best.cmd
  if (best.distance <= 2) return best.cmd
  return null
}

export const runCommand = (name: string, args: string[]): CommandResponse => {
  const command = commands[name.toLowerCase()]

  if (!command) {
    const suggestion = suggestCommand(name)
    if (suggestion) {
      return {
        output: `Command not found: ${name}. Did you mean "${suggestion}"?`,
        type: 'error',
      }
    }
    return {
      output: `Command not found: ${name}. Type "help" to list commands.`,
      type: 'error',
    }
  }

  return command(args)
}

