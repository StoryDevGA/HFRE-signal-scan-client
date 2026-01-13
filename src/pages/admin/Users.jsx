import { useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Dialog from '../../components/Dialog/Dialog.jsx'
import Fieldset from '../../components/Fieldset/Fieldset.jsx'
import Input from '../../components/Input/Input.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import { deleteAdminUser } from '../../services/adminUsers.js'

function AdminUsers() {
  const { addToast } = useToaster()
  const [email, setEmail] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const openConfirm = () => {
    const trimmed = email.trim()
    if (!trimmed) {
      addToast({
        title: 'Email required',
        description: 'Enter the user email to delete.',
        variant: 'warning',
      })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      addToast({
        title: 'Invalid email',
        description: 'Enter a valid email address.',
        variant: 'warning',
      })
      return
    }
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!email.trim() || isDeleting) return
    setIsDeleting(true)
    try {
      const response = await deleteAdminUser(email.trim())
      addToast({
        title: 'User data deleted',
        description: `Deleted ${response?.deletedSubmissions ?? 0} submissions.`,
        variant: 'success',
      })
      setEmail('')
      setConfirmOpen(false)
    } catch (error) {
      addToast({
        title: 'Delete failed',
        description: error?.message || 'Unable to delete user data.',
        variant: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className="admin-section">
      <header className="page__header">
        <h1 className="text-responsive-lg">User data deletion</h1>
        <p className="text-responsive-base">
          Delete all submissions and analytics linked to a user email.
        </p>
      </header>

      <form className="form" onSubmit={(event) => event.preventDefault()}>
        <Fieldset>
          <Fieldset.Legend>Search by email</Fieldset.Legend>
          <Fieldset.Content>
            <Input
              id="delete_user_email"
              type="email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              required
            />
          </Fieldset.Content>
        </Fieldset>

        <div className="admin-actions">
          <Button variant="danger" onClick={openConfirm}>
            Delete user data
          </Button>
        </div>
      </form>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} size="sm">
        <Dialog.Header>
          <h2>Confirm deletion</h2>
        </Dialog.Header>
        <Dialog.Body>
          <p>
            Delete all submissions and analytics for "{email.trim()}"? This
            action cannot be undone.
          </p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Confirm delete'}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </section>
  )
}

export default AdminUsers
