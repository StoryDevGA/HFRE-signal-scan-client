import { useEffect, useState } from 'react'
import './Typewriter.css'

export function Typewriter({
  text = '',
  speed = 100,
  delay = 0,
  loop = false,
  pauseBetween = 1500,
  showCursor = true,
  className = '',
  ariaLabel,
}) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeoutId
    let index = 0

    const startTyping = () => {
      setIsTyping(true)
      timeoutId = window.setInterval(() => {
        index += 1
        setDisplayText(text.slice(0, index))
        if (index >= text.length) {
          window.clearInterval(timeoutId)
          setIsTyping(false)
          if (loop) {
            window.setTimeout(() => {
              index = 0
              setDisplayText('')
              startTyping()
            }, pauseBetween)
          }
        }
      }, speed)
    }

    const start = window.setTimeout(startTyping, delay)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(timeoutId)
    }
  }, [text, speed, delay, loop, pauseBetween])

  return (
    <span
      className={['typewriter', className].filter(Boolean).join(' ')}
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <span className="typewriter__text">{displayText}</span>
      {showCursor ? (
        <span
          className={[
            'typewriter__cursor',
            isTyping && 'typewriter__cursor--active',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        >
          |
        </span>
      ) : null}
    </span>
  )
}

export default Typewriter
