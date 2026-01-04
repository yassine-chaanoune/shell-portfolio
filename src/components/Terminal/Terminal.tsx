import { useEffect } from 'react'
import { Cursor } from './Cursor'
import { Output } from './Output'
import { Prompt } from './Prompt'
import { useTerminal } from '../../hooks/useTerminal'

const Terminal = () => {
  const {
    entries,
    input,
    setInput,
    handleKeyDown,
    focusInput,
    inputRef,
    scrollRef,
    promptLabel,
  } = useTerminal()

  useEffect(() => {
    focusInput()
  }, [focusInput])

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-terminal-bg to-black px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-slate-800 bg-terminal-panel/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <header className="flex items-center gap-3 border-b border-slate-800 bg-terminal-panel px-4 py-3 text-xs uppercase tracking-[0.08em] text-terminal-muted">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <span className="font-medium text-slate-300">~/portfolio</span>
        </header>

        <div
          ref={scrollRef}
          className="terminal-scroll max-h-[70vh] overflow-y-auto px-4 py-5 text-sm"
          onClick={focusInput}
          role="application"
          aria-label="Portfolio terminal"
        >
          <div className="space-y-4">
            {entries.map((entry) => (
              <Output key={entry.id} entry={entry} />
            ))}

            <div className="flex items-center gap-2">
              <Prompt path={promptLabel} />
              <div className="relative flex-1">
                <div className="pointer-events-none flex min-h-[1.5rem] flex-wrap items-center gap-1 whitespace-pre-wrap break-words text-gray-100">
                  {input.length ? input : ''}
                  <Cursor />
                </div>
                <input
                  ref={inputRef}
                  aria-label="Terminal input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent outline-none"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Terminal

