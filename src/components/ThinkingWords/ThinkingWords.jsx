import { useEffect, useMemo, useState } from 'react'
import './ThinkingWords.css'

export function ThinkingWords({
  words = [
    'Thinking',
    'Scanning',
    'Synthesizing',
    'Connecting dots',
    'Reading signals',
    'Assembling insights',
  ],
  interval = 900,
  className = '',
}) {
  const safeWords = useMemo(
    () => (Array.isArray(words) && words.length ? words : ['Thinking']),
    [words]
  )
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (safeWords.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeWords.length)
    }, interval)
    return () => window.clearInterval(timer)
  }, [interval, safeWords])

  return (
    <div className={['thinking-words', className].filter(Boolean).join(' ')}>
      <span className="thinking-words__divider" aria-hidden="true">
        ...
      </span>
      <span className="thinking-words__word" aria-live="polite">
        {safeWords[index]}
      </span>
      <span className="thinking-words__divider" aria-hidden="true">
        ...
      </span>
    </div>
  )
}

export default ThinkingWords
