/**
 * Tickbox Component
 *
 * A custom-styled, accessible checkbox component.
 */

import { forwardRef, useEffect, useRef } from 'react'
import { MdCheck, MdRemove } from 'react-icons/md'
import './Tickbox.css'

export const Tickbox = forwardRef(function Tickbox(
  {
    id,
    label,
    checked = false,
    indeterminate = false,
    onChange,
    disabled = false,
    size = 'md',
    className = '',
    ...props
  },
  ref
) {
  const localRef = useRef(null)
  const inputRef = ref || localRef

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate, inputRef])

  const containerClasses = [
    'tickbox-container',
    `tickbox-container--${size}`,
    disabled && 'tickbox-container--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label htmlFor={id} className={containerClasses}>
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        className="tickbox-input"
        checked={checked}
        onChange={onChange}
      disabled={disabled}
      {...props}
    />
      <span className="tickbox-box">
        {indeterminate ? (
          <MdRemove className="tickbox-icon" aria-hidden="true" focusable="false" />
        ) : (
          <MdCheck className="tickbox-icon" aria-hidden="true" focusable="false" />
        )}
      </span>
      {label && <span className="tickbox-label">{label}</span>}
    </label>
  )
})

Tickbox.displayName = 'Tickbox'

export default Tickbox
