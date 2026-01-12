function FormField({ id, label, error, helperText, children }) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="form-field__control">{children}</div>
      {error ? (
        <div className="form-field__error" role="alert">
          {error}
        </div>
      ) : helperText ? (
        <div className="form-field__helper">{helperText}</div>
      ) : null}
    </div>
  )
}

export default FormField
