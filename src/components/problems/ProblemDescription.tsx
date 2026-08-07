import { cn } from '@/lib/utils'

type ProblemDescriptionProps = {
  markdown: string | null | undefined
  className?: string
}

type Block =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'code'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; text: string }

function parseBlocks(markdown: string): Block[] {
  return markdown
    .trim()
    .split(/\n\n+/)
    .map((raw) => {
      const block = raw.trim()
      if (block.startsWith('```')) {
        const lines = block.split('\n')
        const endsWithFence = lines.at(-1)?.startsWith('```')
        return {
          type: 'code' as const,
          text: lines.slice(1, endsWithFence ? -1 : undefined).join('\n'),
        }
      }
      if (block.startsWith('### '))
        return { type: 'heading' as const, level: 3 as const, text: block.slice(4) }
      if (block.startsWith('## '))
        return { type: 'heading' as const, level: 2 as const, text: block.slice(3) }
      if (block.startsWith('- ')) {
        return {
          type: 'list' as const,
          items: block
            .split('\n')
            .filter((line) => line.startsWith('- '))
            .map((line) => line.slice(2)),
        }
      }
      return { type: 'paragraph' as const, text: block }
    })
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="bg-muted rounded px-1.5 py-0.5 font-mono text-[13px] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

/** Lightweight markdown-ish renderer for problem statements. */
export function ProblemDescription({ markdown, className }: ProblemDescriptionProps) {
  const trimmed = markdown?.trim() ?? ''
  if (!trimmed) {
    return <p className="text-muted-foreground text-sm">No description provided.</p>
  }

  const blocks = parseBlocks(trimmed)

  return (
    <div className={cn('text-muted-foreground space-y-4 text-[15px] leading-7', className)}>
      {blocks.map((block, index) => {
        if (block.type === 'code') {
          return (
            <pre
              key={index}
              className="bg-muted/50 overflow-x-auto rounded-lg border px-4 py-3 font-mono text-[13px] text-foreground"
            >
              {block.text}
            </pre>
          )
        }
        if (block.type === 'heading') {
          const HeadingTag = block.level === 2 ? 'h2' : 'h3'
          return (
            <HeadingTag
              key={index}
              className={
                block.level === 2
                  ? 'text-foreground text-xl font-semibold tracking-tight'
                  : 'text-foreground pt-1 text-base font-semibold'
              }
            >
              <InlineText text={block.text} />
            </HeadingTag>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.items.map((item, i) => (
                <li key={i}>
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={index} className="whitespace-pre-wrap">
            <InlineText text={block.text} />
          </p>
        )
      })}
    </div>
  )
}
