import './Link.css'

export function Link({
  href,
  children,
  className = '',
  target,
  rel,
  ...props
}) {
  const classNames = ['link', className].filter(Boolean).join(' ')
  const resolvedRel = target === '_blank' ? rel || 'noopener noreferrer' : rel

  return (
    <a
      href={href}
      className={classNames}
      target={target}
      rel={resolvedRel}
      {...props}
    >
      {children}
    </a>
  )
}

export default Link
