import './Pill.css'

export function Pill({
  as: Component = 'span',
  children,
  leftIcon,
  rightIcon,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) {
  const classNames = [
    'pill',
    `pill--${variant}`,
    `pill--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classNames} {...props}>
      {leftIcon ? (
        <span className="pill__icon pill__icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      <span className="pill__content">{children}</span>
      {rightIcon ? (
        <span className="pill__icon pill__icon--right" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </Component>
  )
}

export default Pill
