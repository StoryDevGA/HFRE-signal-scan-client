import './Card.css'

export function Card({
  children,
  variant = 'default',
  rounded = false,
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) {
  const cardClasses = [
    'card',
    `card--${variant}`,
    rounded ? 'card--rounded' : 'card--square',
    hoverable && 'card--hoverable',
    clickable && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleKeyDown = (event) => {
    if (!clickable) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.(event)
    }
  }

  return (
    <article
      className={cardClasses}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </article>
  )
}

Card.Image = function CardImage({ src, alt = '', className = '', ...props }) {
  const classes = ['card__image', className].filter(Boolean).join(' ')
  return <img src={src} alt={alt} className={classes} {...props} />
}

Card.Header = function CardHeader({ children, className = '', ...props }) {
  const classes = ['card__header', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

Card.Body = function CardBody({ children, className = '', ...props }) {
  const classes = ['card__body', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children, className = '', ...props }) {
  const classes = ['card__footer', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card
