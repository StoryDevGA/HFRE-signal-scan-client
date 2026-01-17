import { Children, cloneElement, useEffect, useId, useRef, useState } from 'react'
import './Tooltip.css'

export function Tooltip({
  content,
  position = 'top',
  align = 'center',
  open,
  defaultOpen = false,
  openDelay = 80,
  closeDelay = 80,
  className = '',
  id,
  children,
}) {
  const trigger = Children.only(children)
  const tooltipId = id || useId()
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const openTimer = useRef(null)
  const closeTimer = useRef(null)
  const isControlled = open !== undefined

  useEffect(() => {
    if (isControlled) {
      setIsOpen(open)
    }
  }, [open, isControlled])

  useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current)
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [])

  const scheduleOpen = () => {
    if (isControlled) return
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    openTimer.current = window.setTimeout(() => setIsOpen(true), openDelay)
  }

  const scheduleClose = () => {
    if (isControlled) return
    if (openTimer.current) window.clearTimeout(openTimer.current)
    closeTimer.current = window.setTimeout(() => setIsOpen(false), closeDelay)
  }

  const triggerProps = {
    onMouseEnter: (event) => {
      trigger.props.onMouseEnter?.(event)
      scheduleOpen()
    },
    onMouseLeave: (event) => {
      trigger.props.onMouseLeave?.(event)
      scheduleClose()
    },
    onFocus: (event) => {
      trigger.props.onFocus?.(event)
      scheduleOpen()
    },
    onBlur: (event) => {
      trigger.props.onBlur?.(event)
      scheduleClose()
    },
    'aria-describedby': tooltipId,
  }

  const wrapperClasses = [
    'tooltip',
    `tooltip--${position}`,
    `tooltip--align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapperClasses}>
      {cloneElement(trigger, triggerProps)}
      <span
        id={tooltipId}
        className="tooltip__content"
        role="tooltip"
        aria-hidden={!isOpen}
        data-open={isOpen ? 'true' : 'false'}
      >
        {content}
        <span className="tooltip__arrow" aria-hidden="true" />
      </span>
    </span>
  )
}

export default Tooltip
