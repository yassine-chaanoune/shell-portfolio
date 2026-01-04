import { useState } from 'react'

export const useHistory = () => {
  const [commands, setCommands] = useState<string[]>([])
  const [index, setIndex] = useState<number | null>(null)

  const push = (command: string) => {
    if (!command.trim()) return
    setCommands((prev) => [...prev, command])
    setIndex(null)
  }

  const previous = () => {
    if (!commands.length) return ''
    const nextIndex = index === null ? commands.length - 1 : Math.max(0, index - 1)
    setIndex(nextIndex)
    return commands[nextIndex] ?? ''
  }

  const next = () => {
    if (index === null) return ''
    const nextIndex = index + 1
    if (nextIndex >= commands.length) {
      setIndex(null)
      return ''
    }
    setIndex(nextIndex)
    return commands[nextIndex] ?? ''
  }

  const reset = () => {
    setCommands([])
    setIndex(null)
  }

  return { push, previous, next, reset }
}

