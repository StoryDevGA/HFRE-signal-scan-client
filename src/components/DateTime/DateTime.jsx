import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import './DateTime.css'

export function DateTime({
  dateFormat = 'EEEE, MMMM d, yyyy',
  timeFormat = 'hh:mm:ss a',
  updateInterval = 1000,
  className = '',
}) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, updateInterval)
    return () => window.clearInterval(interval)
  }, [updateInterval])

  const dateText = format(now, dateFormat)
  const timeText = format(now, timeFormat)

  return (
    <time
      className={['datetime', className].filter(Boolean).join(' ')}
      dateTime={now.toISOString()}
      aria-live="polite"
    >
      <span className="datetime__date">{dateText}</span>
      <span className="datetime__separator"> | </span>
      <span className="datetime__time">{timeText}</span>
    </time>
  )
}

export default DateTime

