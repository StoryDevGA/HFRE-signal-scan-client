import { forwardRef } from 'react'
import './Radio.css'

export const Radio = forwardRef(function Radio(
  {
    id,
    name,
    value,
    label,
    description,
    checked = false,
    onChange,
    disabled = false,
    size = 'md',
    className = '',
    ...props
  },
  ref
) {
  const containerClasses = [
    'radio-container',
    `radio-container--${size}`,
    disabled && 'radio-container--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label htmlFor={id} className={containerClasses}>
      <input
        ref={ref}
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="radio-input"
        {...props}
      />
      <span className="radio-button" aria-hidden="true">
        <span className="radio-inner" />
      </span>
      {label && (
        <span className="radio-text">
          <span className="radio-label">{label}</span>
          {description ? (
            <span className="radio-description">{description}</span>
          ) : null}
        </span>
      )}
    </label>
  )
})

Radio.displayName = 'Radio'

export default Radio
