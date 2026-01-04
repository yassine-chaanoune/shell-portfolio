import { useCallback, useMemo, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { runCommand } from '../commands'
import { useHistory } from './useHistory'
import type { CommandResponse } from '../commands'
import { sendMessage } from '../lib/email'

export type TerminalEntry = {
  id: string
  prompt: string
  input: string
  result?: CommandResponse
}

const createId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`

const normalPrompt = 'yassine@portfolio'
const messagePrompt = 'message#'

const welcomeEntry: TerminalEntry = {
  id: 'welcome',
  prompt: normalPrompt,
  input: '',
  result: {
    output: [
      'Welcome to the terminal portfolio.',
      'Type "help" to explore available commands.',
    ],
    type: 'info',
  },
}

export const useTerminal = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [entries, setEntries] = useState<TerminalEntry[]>([welcomeEntry])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'normal' | 'message'>('normal')
  const [promptLabel, setPromptLabel] = useState(normalPrompt)
  const [messageFlow, setMessageFlow] = useState<{
    step: 'name' | 'email' | 'body'
    draft: { name: string; email: string; body: string }
  } | null>(null)
  const { push, previous, next, reset } = useHistory()

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const setCaretPosition = useCallback((position: number) => {
    const node = inputRef.current
    if (!node) return
    const next = Math.max(0, Math.min(position, node.value.length))
    node.setSelectionRange(next, next)
  }, [])

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  const resetTerminal = useCallback(() => {
    setEntries([welcomeEntry])
    setInput('')
    setMode('normal')
    setPromptLabel(normalPrompt)
    reset()
    focusInput()
    scrollToBottom()
  }, [focusInput, reset, scrollToBottom])

  const startMessageFlow = useCallback(() => {
    setMessageFlow({ step: 'name', draft: { name: '', email: '', body: '' } })
    setMode('message')
    setPromptLabel(messagePrompt)
    setEntries((prev) => [
      ...prev,
      {
        id: createId(),
        prompt: promptLabel,
        input: 'message',
        result: {
          output: [
            'Leave a message',
            'Step 1/3: Enter your full name.',
            'Then provide email and message when prompted.',
          ],
          type: 'info',
        },
      },
    ])
    setInput('')
    focusInput()
    scrollToBottom()
  }, [focusInput, promptLabel, scrollToBottom])

  const appendInterrupt = useCallback(() => {
    setEntries((prev) => [
      ...prev,
      {
        id: createId(),
        prompt: promptLabel,
        input,
        result: { output: '^C', type: 'info' },
      },
    ])
    setInput('')
    focusInput()
    scrollToBottom()
  }, [focusInput, input, promptLabel, scrollToBottom])

  const handleMessageFlow = useCallback(
    (answer: string) => {
      if (!messageFlow) return

      const { step, draft } = messageFlow

      const addEntry = (note: string) => {
        setEntries((prev) => [
          ...prev,
          {
            id: createId(),
            prompt: promptLabel,
            input: answer,
            result: { output: note, type: 'info' },
          },
        ])
        setInput('')
        focusInput()
        scrollToBottom()
      }

      if (step === 'name') {
        const nextDraft = { ...draft, name: answer }
        addEntry('Step 2/3: Enter your email.')
        setMessageFlow({ step: 'email', draft: nextDraft })
        return
      }

      if (step === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(answer)) {
          addEntry('Invalid email. Please enter a valid email.')
          setMessageFlow({ step: 'email', draft })
          return
        }
        const nextDraft = { ...draft, email: answer }
        addEntry('Step 3/3: Enter your message.')
        setMessageFlow({ step: 'body', draft: nextDraft })
        return
      }

      // step === 'body'
      const finalDraft = { ...draft, body: answer }
      setEntries((prev) => [
        ...prev,
        {
          id: createId(),
          prompt: promptLabel,
          input: answer,
          result: { output: 'Sending your message...', type: 'info' },
        },
      ])
      setInput('')
      focusInput()
      scrollToBottom()
      setMessageFlow(null)

      sendMessage({ name: finalDraft.name, email: finalDraft.email, message: finalDraft.body })
        .then(() => {
          setEntries((prev) => [
            ...prev,
            {
              id: createId(),
              prompt: promptLabel,
              input: '',
              result: { output: 'Message sent successfully. Thank you!', type: 'info' },
            },
          ])
          scrollToBottom()
        })
        .catch(() => {
          setEntries((prev) => [
            ...prev,
            {
              id: createId(),
              prompt: promptLabel,
              input: '',
              result: {
                output:
                  'Failed to send message. Please try again later or check EmailJS configuration.',
                type: 'error',
              },
            },
          ])
          scrollToBottom()
        })
    },
    [focusInput, messageFlow, promptLabel, scrollToBottom],
  )

  const appendEntry = useCallback(
    (commandText: string) => {
      const trimmed = commandText.trim()
      if (!trimmed) return

      if (mode === 'message') {
        if (trimmed === 'clear') {
          resetTerminal()
          return
        }

        if (trimmed === '/q') {
          push(trimmed)
          setMode('normal')
          setPromptLabel(normalPrompt)
          setMessageFlow(null)
          setEntries((prev) => [
            ...prev,
            {
              id: createId(),
              prompt: messagePrompt,
              input: trimmed,
              result: { output: 'Exited message mode.', type: 'info' },
            },
          ])
          setInput('')
          focusInput()
          scrollToBottom()
          return
        }

        push(trimmed)
        handleMessageFlow(trimmed)
        return
      }

      if (trimmed === 'clear') {
        resetTerminal()
        return
      }

      if (trimmed === 'message') {
        startMessageFlow()
        push(trimmed)
        return
      }

      const [commandName, ...args] = trimmed.split(/\s+/)
      const result = runCommand(commandName, args)

      const entry: TerminalEntry = {
        id: createId(),
        prompt: promptLabel,
        input: trimmed,
        result,
      }

      setEntries((prev) => [...prev, entry])
      push(trimmed)
      setInput('')
      focusInput()
      scrollToBottom()
    },
    // Including messageFlow to ensure mode guard stays in sync; suppressing lint suggestion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      focusInput,
      handleMessageFlow,
      messageFlow,
      mode,
      promptLabel,
      push,
      resetTerminal,
      scrollToBottom,
      startMessageFlow,
    ],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        appendEntry(input)
        return
      }

      if (event.ctrlKey) {
        const key = event.key.toLowerCase()

        if (key === 'c') {
          event.preventDefault()
          appendInterrupt()
          return
        }

        if (key === 'l') {
          event.preventDefault()
          resetTerminal()
          return
        }

        if (key === 'u') {
          event.preventDefault()
          setInput('')
          focusInput()
          return
        }

        if (key === 'k') {
          event.preventDefault()
          const cursor = inputRef.current?.selectionStart ?? input.length
          setInput((current) => current.slice(0, cursor))
          setCaretPosition(cursor)
          return
        }

        if (key === 'a') {
          event.preventDefault()
          focusInput()
          setCaretPosition(0)
          return
        }

        if (key === 'e') {
          event.preventDefault()
          const end = input.length
          focusInput()
          setCaretPosition(end)
          return
        }
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setInput(previous())
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setInput(next())
        return
      }

      if (event.key === 'Tab') {
        event.preventDefault()
      }
    },
    [appendEntry, appendInterrupt, focusInput, input, next, previous, resetTerminal, setCaretPosition],
  )

  useEffect(() => {
    focusInput()
    scrollToBottom()
  }, [entries, focusInput, scrollToBottom])

  return useMemo(
    () => ({
      entries,
      input,
      setInput,
      handleKeyDown,
      focusInput,
      inputRef,
      scrollRef,
      promptLabel,
    }),
    [entries, focusInput, handleKeyDown, input, promptLabel, scrollRef],
  )
}

