import type { CommandHandler } from './index'

export const messageCommand: CommandHandler = () => ({
  output: [
    'Leave a message. We will ask for your name, email, and message.',
    'Step 1: type your full name and press Enter.',
  ],
  type: 'info',
})

