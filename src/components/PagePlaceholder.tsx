import type { ReactNode } from 'react'

/**
 * Placeholder for a screen that Claude Design will generate (Track 1).
 * Replaced wholesale when the real TSX drops into the feature folder.
 */
export function PagePlaceholder({
  title,
  intent,
  children,
}: {
  title: string
  intent: string
  children?: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <span className="mm-eyebrow">Placeholder</span>
        <h1 className="mm-h1">{title}</h1>
        <p className="mm-body text-secondary">{intent}</p>
      </header>
      {children}
    </section>
  )
}
