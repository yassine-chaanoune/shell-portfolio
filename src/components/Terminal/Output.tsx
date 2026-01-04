import { Prompt } from './Prompt'
import type { TerminalEntry } from '../../hooks/useTerminal'

type OutputProps = {
  entry: TerminalEntry
}

export const Output = ({ entry }: OutputProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Prompt path={entry.prompt} />
        <span className="text-gray-100">{entry.input}</span>
      </div>

      {entry.result && (
        <div
          className="text-terminal-muted px-3 py-2 text-[13px] leading-relaxed"
          role={entry.result.type === 'error' ? 'alert' : 'status'}
        >
          {Array.isArray(entry.result.output) ? (
            entry.result.output.map((line, index) => <div key={`${entry.id}-line-${index}`}>{line}</div>)
          ) : (
            <div>{entry.result.output}</div>
          )}
        </div>
      )}
    </div>
  )
}

