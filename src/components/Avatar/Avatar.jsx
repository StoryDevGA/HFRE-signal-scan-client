import { useMemo, useState } from 'react'
import { MdPerson } from 'react-icons/md'
import './Avatar.css'

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  ...props
}) {
  const [imageError, setImageError] = useState(false)
  const initials = useMemo(() => getInitials(name), [name])
  const showImage = src && !imageError
  const resolvedAlt = alt || name || 'Avatar'

  const classes = [
    'avatar',
    `avatar--${size}`,
    `avatar--${shape}`,
    status && `avatar--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} aria-label={name || 'Avatar'} {...props}>
      {showImage ? (
        <img
          src={src}
          alt={resolvedAlt}
          className="avatar__image"
          onError={() => setImageError(true)}
        />
      ) : name ? (
        <span className="avatar__initials">{initials}</span>
      ) : (
        <MdPerson className="avatar__icon" aria-hidden="true" />
      )}
      {status ? (
        <span
          className="avatar__status"
          role="status"
          aria-label={`Status: ${status}`}
        />
      ) : null}
    </span>
  )
}

export default Avatar
