/**
 * Select Component
 *
 * A custom-styled, accessible select dropdown component.
 */

import { forwardRef } from 'react'
import './Select.css'

export const Select = forwardRef(function Select(
  {
    id,
    name,
    label,
    value,
    onChange,
    options = [],
    placeholder,
    disabled = false,
    error,
    helperText,
    size = 'md',
    className = '',
    ...props
  },
  ref
) {
  const containerClasses = [
    'select-container',
    `select-container--${size}`,
    disabled && 'select-container--disabled',
    error && 'select-container--error',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const selectClasses = [
    'select',
    `select--${size}`,
    !value && 'select--placeholder',
  ].join(' ')

  return (
    <div className={containerClasses}>
      {label && <label htmlFor={id} className="select-label">{label}</label>}
      <div className="select-wrapper">
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={selectClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-arrow" />
      </div>
      {error && (
        <span className="select-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="select-helper" id={`${id}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
