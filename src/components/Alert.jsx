function Alert({ variant = 'info', title, children }) {
  return (
    <div className={`alert alert--${variant}`} role="alert">
      {title ? <div className="alert__title">{title}</div> : null}
      <div className="alert__body">{children}</div>
    </div>
  )
}

export default Alert
