/**
 * Input Component
 *
 * Professional input component with floating label animation
 * that reduces in size and moves outside when focused or filled.
 */

import { useState, forwardRef } from 'react'
import './Input.css'

/**
 * Main Input Component
 */
export const Input = forwardRef(function Input(
  {
    type = 'text',
    label,
    placeholder,
    leftIcon,
    rightIcon,
    value,
    defaultValue,
    error,
    helperText,
    disabled = false,
    required = false,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    className = '',
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!defaultValue || !!value)
  const hasLeftIcon = Boolean(leftIcon)
  const hasRightIcon = Boolean(rightIcon)

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    setHasValue(!!e.target.value)
    onBlur?.(e)
  }

  const handleChange = (e) => {
    setHasValue(!!e.target.value)
    props.onChange?.(e)
  }

  const isLabelFloating = isFocused || hasValue

  const containerClasses = [
    'input-container',
    `input-container--${variant}`,
    `input-container--${size}`,
    fullWidth && 'input-container--full-width',
    disabled && 'input-container--disabled',
    error && 'input-container--error',
    isLabelFloating && 'input-container--floating',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inputClasses = [
    'input',
    `input--${variant}`,
    `input--${size}`,
    hasLeftIcon && 'input--with-left-icon',
    hasRightIcon && 'input--with-right-icon',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses}>
      <div className="input-wrapper">
        {hasLeftIcon && (
          <span className="input__icon input__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${props.id}-error`
              : helperText
              ? `${props.id}-helper`
              : undefined
          }
          {...props}
        />
        {hasRightIcon && (
          <span className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
        {label && (
          <label
            className={`input-label ${isLabelFloating ? 'input-label--floating' : ''}`}
            htmlFor={props.id}
          >
            {label}
            {required && <span className="input-label__required"> *</span>}
          </label>
        )}
      </div>
      {error && (
        <span className="input-error" id={`${props.id}-error`} role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="input-helper" id={`${props.id}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
