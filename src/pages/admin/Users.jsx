import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Accordion from '../../components/Accordion/Accordion.jsx'
import Button from '../../components/Button/Button.jsx'
import Dialog from '../../components/Dialog/Dialog.jsx'
import Fieldset from '../../components/Fieldset/Fieldset.jsx'
import HorizontalScroll from '../../components/HorizontalScroll/HorizontalScroll.jsx'
import Input from '../../components/Input/Input.jsx'
import Table from '../../components/Table/Table.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import Tooltip from '../../components/Tooltip/Tooltip.jsx'
import { ApiError } from '../../lib/api.js'
import { getAdminSubmissions } from '../../services/adminSubmissions.js'
import { deleteAdminUser } from '../../services/adminUsers.js'

function AdminUsers() {
  const navigate = useNavigate()
  const { addToast } = useToaster()
  const [email, setEmail] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const columns = useMemo(
    () => [
      { key: 'email', label: 'EMAIL' },
      { key: 'company', label: 'COMPANY' },
      { key: 'count', label: 'SUBMISSIONS' },
      { key: 'lastSeen', label: 'LAST SUBMISSION' },
    ],
    []
  )

  const buildUsers = (submissions = []) => {
    const map = new Map()
    submissions.forEach((submission) => {
      const submissionEmail = submission.inputs?.email || submission.email
      if (!submissionEmail) return
      const companyName =
        submission.inputs?.company_name || submission.company || ''
      const createdAt = submission.createdAt
      const existing = map.get(submissionEmail)
      if (!existing) {
        map.set(submissionEmail, {
          email: submissionEmail,
          company: companyName,
          count: 1,
          lastSeen: createdAt,
        })
        return
      }
      existing.count += 1
      if (createdAt && (!existing.lastSeen || createdAt > existing.lastSeen)) {
        existing.lastSeen = createdAt
      }
      if (!existing.company && companyName) {
        existing.company = companyName
      }
    })

    return Array.from(map.values()).sort((a, b) => {
      if (!a.lastSeen && !b.lastSeen) return 0
      if (!a.lastSeen) return 1
      if (!b.lastSeen) return -1
      return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    })
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await getAdminSubmissions({ page: 1, pageSize: 100 })
      const submissions =
        response?.submissions ||
        response?.items ||
        response?.data ||
        response?.results ||
        []
      setUsers(buildUsers(submissions))
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        navigate('/admin/login', { replace: true })
        return
      }
      setErrorMessage(error?.message || 'Unable to load users.')
    } finally {
      setIsLoading(false)
    }
  }

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

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rows = users.map((user) => ({
    id: user.email,
    email: user.email,
    company: user.company || 'N/A',
    count: user.count,
    lastSeen: user.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'N/A',
  }))

  return (
    <section className="admin-section">
      <header className="page__header">
        <h1 className="text-responsive-lg">Users</h1>
        <p className="text-responsive-base">
          Review users from submissions and delete data by email.
        </p>
      </header>

      {errorMessage ? (
        <p className="text-responsive-base">{errorMessage}</p>
      ) : null}

      <HorizontalScroll ariaLabel="Users table" className="admin-scroll">
        <Table
          columns={columns}
          data={rows}
          variant="striped"
          hoverable
          actions={[
            {
              label: 'Use email',
              variant: 'ghost',
              onClick: (row) => setEmail(row.email),
            },
          ]}
          loading={isLoading}
          emptyMessage="No users found yet."
          ariaLabel="Users list"
        />
      </HorizontalScroll>

      <Accordion variant="outlined" defaultOpenItems={['delete-user']}>
        <Accordion.Item id="delete-user">
          <Accordion.Header itemId="delete-user">Delete user data</Accordion.Header>
          <Accordion.Content itemId="delete-user">
            <form className="form" onSubmit={(event) => event.preventDefault()}>
              <Fieldset>
                <Fieldset.Legend>Delete user data</Fieldset.Legend>
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
                <Tooltip content="Deletes all submissions and analytics for this email.">
                  <Button variant="danger" onClick={openConfirm} size="xs">
                    Delete user data
                  </Button>
                </Tooltip>
              </div>
            </form>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

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
            size="xs"
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={isDeleting} size="xs">
            {isDeleting ? 'Deleting...' : 'Confirm delete'}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </section>
  )
}

export default AdminUsers

