import Button from './Button.jsx'

function ConfirmModal({
  open,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onCancel} />
      <div className="modal__content">
        <div className="modal__header">
          <h2>{title}</h2>
        </div>
        {message ? <p className="modal__message">{message}</p> : null}
        <div className="modal__actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
