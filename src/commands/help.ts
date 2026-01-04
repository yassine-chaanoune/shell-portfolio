import type { CommandHandler } from './index'

const items = [
  'help',
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'languages',
  'contact',
  'fun',
  'message',
  'clear',
]

export const helpCommand: CommandHandler = () => ({
  output: [
    'Available commands:',
    ...items.map((command) => `- ${command}`),
    '',
    'Use arrow keys to navigate history and press Enter to run a command.',
  ],
  type: 'info',
})

