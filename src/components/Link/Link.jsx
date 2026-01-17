import { Link as RouterLink } from 'react-router-dom'
import './Link.css'

const isExternalHref = (value) => /^(https?:)?\/\//i.test(value || '')

export function Link({
  children,
  to,
  href,
  variant = 'primary',
  underline = 'none',
  disabled = false,
  external = false,
  openInNewTab = false,
  className = '',
  rel,
  ...props
}) {
  const destination = href || to || ''
  const isExternal = external || isExternalHref(destination)
  const shouldOpenInNewTab = openInNewTab || (isExternal && props.target === '_blank')
  const resolvedRel = shouldOpenInNewTab ? rel || 'noopener noreferrer' : rel

  const classNames = [
    'link',
    `link--${variant}`,
    `link--underline-${underline}`,
    disabled && 'link--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const sharedProps = {
    className: classNames,
    rel: resolvedRel,
    'aria-disabled': disabled || undefined,
    ...props,
  }

  if (disabled) {
    return (
      <span className={classNames} aria-disabled="true">
        {children}
      </span>
    )
  }

  if (isExternal) {
    return (
      <a
        href={destination}
        target={shouldOpenInNewTab ? '_blank' : props.target}
        {...sharedProps}
      >
        {children}
        {shouldOpenInNewTab ? (
          <span className="link__external-indicator" aria-hidden="true">
            ext
          </span>
        ) : null}
        {shouldOpenInNewTab ? (
          <span className="sr-only">(opens in new tab)</span>
        ) : null}
      </a>
    )
  }

  return (
    <RouterLink to={destination} {...sharedProps}>
      {children}
    </RouterLink>
  )
}

export default Link
