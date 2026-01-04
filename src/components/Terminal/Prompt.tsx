type PromptProps = {
  path: string
}

export const Prompt = ({ path }: PromptProps) => {
  return (
    <div className="flex items-center gap-1 text-terminal-accent">
      <span className="font-semibold text-terminal-accent">yassine@portfolio</span>
      <span className="text-terminal-muted">{path}</span>
      <span className="text-terminal-muted">$</span>
    </div>
  )
}

