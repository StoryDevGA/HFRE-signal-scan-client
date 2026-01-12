function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
}) {
  const className = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    loading ? 'btn--loading' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <span className="spinner spinner--inline" /> : null}
      <span className="btn__label">{children}</span>
    </button>
  )
}

export default Button
