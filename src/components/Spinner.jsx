function Spinner({ size = 'md' }) {
  const className = ['spinner', `spinner--${size}`].join(' ')

  return <span className={className} aria-hidden="true" />
}

export default Spinner
