import './HorizontalScroll.css'

export function HorizontalScroll({
  gap = 'md',
  snap = false,
  ariaLabel = 'Horizontal content',
  className = '',
  children,
  ...props
}) {
  const classes = [
    'horizontal-scroll',
    `horizontal-scroll--${gap}`,
    snap && 'horizontal-scroll--snap',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role="region" aria-label={ariaLabel} {...props}>
      {children}
    </div>
  )
}

export default HorizontalScroll
