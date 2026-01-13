import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Dialog from '../../components/Dialog/Dialog.jsx'
import Fieldset from '../../components/Fieldset/Fieldset.jsx'
import Input from '../../components/Input/Input.jsx'
import Select from '../../components/Select/Select.jsx'
import Table from '../../components/Table/Table.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import { ApiError } from '../../lib/api.js'
import {
  createAdminPrompt,
  deleteAdminPrompt,
  getAdminPrompts,
  updateAdminPrompt,
} from '../../services/adminPrompts.js'

const typeOptions = [
  { value: 'system', label: 'System' },
  { value: 'user', label: 'User' },
]

const emptyForm = {
  id: null,
  name: '',
  type: 'system',
  content: '',
  active: false,
  version: '',
}

function normalizePrompts(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.prompts)) return payload.prompts
  return []
}

function AdminPrompts() {
  const { addToast } = useToaster()
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const loadPrompts = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const response = await getAdminPrompts()
      setPrompts(normalizePrompts(response))
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to load prompts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrompts()
  }, [])

  const startCreate = () => {
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const startEdit = (prompt) => {
    setForm({
      id: prompt._id || prompt.id,
      name: prompt.name || '',
      type: prompt.type || 'system',
      content: prompt.content || '',
      active: Boolean(prompt.active),
      version: prompt.version ?? '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      addToast({
        title: 'Missing fields',
        description: 'Name and content are required.',
        variant: 'warning',
      })
      return
    }

    setSaving(true)
    try {
      const payload = {
        type: form.type,
        name: form.name.trim(),
        content: form.content.trim(),
        active: Boolean(form.active),
        version: form.version === '' ? undefined : Number(form.version),
      }

      if (form.id) {
        await updateAdminPrompt(form.id, payload)
        addToast({
          title: 'Prompt updated',
          description: 'Your changes have been saved.',
          variant: 'success',
        })
      } else {
        await createAdminPrompt(payload)
        addToast({
          title: 'Prompt created',
          description: 'The prompt was added.',
          variant: 'success',
        })
      }
      setDialogOpen(false)
      await loadPrompts()
    } catch (error) {
      addToast({
        title: 'Save failed',
        description: error?.message || 'Unable to save the prompt.',
        variant: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const confirmDeletePrompt = (prompt) => {
    setConfirmDelete(prompt)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteAdminPrompt(confirmDelete._id || confirmDelete.id)
      addToast({
        title: 'Prompt deleted',
        description: 'The prompt has been removed.',
        variant: 'success',
      })
      setConfirmDelete(null)
      await loadPrompts()
    } catch (error) {
      addToast({
        title: 'Delete failed',
        description: error?.message || 'Unable to delete the prompt.',
        variant: 'error',
      })
    }
  }

  const rows = useMemo(
    () =>
      prompts.map((prompt) => ({
        id: prompt._id || prompt.id,
        name: prompt.name,
        type: prompt.type,
        version: prompt.version ?? '-',
        active: prompt.active ? 'Yes' : 'No',
      })),
    [prompts]
  )

  return (
    <section className="admin-section">
      <header className="page__header">
        <h1 className="text-responsive-lg">Prompts</h1>
        <p className="text-responsive-base">
          Manage system and user prompts for the scan agent.
        </p>
      </header>

      <div className="admin-actions">
        <Button onClick={startCreate}>New prompt</Button>
      </div>

      {errorMessage ? (
        <p className="text-responsive-base">{errorMessage}</p>
      ) : null}

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'version', label: 'Version' },
          { key: 'active', label: 'Active' },
        ]}
        data={rows}
        variant="striped"
        hoverable
        loading={loading}
        emptyMessage="No prompts found."
        actions={[
          {
            label: 'Edit',
            variant: 'ghost',
            onClick: (row) => {
              const prompt = prompts.find(
                (item) => (item._id || item.id) === row.id
              )
              if (prompt) startEdit(prompt)
            },
          },
          {
            label: 'Delete',
            variant: 'danger',
            onClick: (row) => {
              const prompt = prompts.find(
                (item) => (item._id || item.id) === row.id
              )
              if (prompt) confirmDeletePrompt(prompt)
            },
          },
        ]}
        ariaLabel="Prompts list"
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} size="lg">
        <Dialog.Header>
          <h2>{form.id ? 'Edit prompt' : 'New prompt'}</h2>
        </Dialog.Header>
        <Dialog.Body>
          <form className="form" onSubmit={(event) => event.preventDefault()}>
            <Fieldset>
              <Fieldset.Legend>Prompt details</Fieldset.Legend>
              <Fieldset.Content>
                <Input
                  id="prompt_name"
                  label="Name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                  fullWidth
                />
                <Select
                  id="prompt_type"
                  label="Type"
                  value={form.type}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, type: event.target.value }))
                  }
                  options={typeOptions}
                />
                <Input
                  id="prompt_version"
                  label="Version"
                  type="number"
                  value={form.version}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, version: event.target.value }))
                  }
                />
                <Select
                  id="prompt_active"
                  label="Active"
                  value={form.active ? 'true' : 'false'}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      active: event.target.value === 'true',
                    }))
                  }
                  options={[
                    { value: 'true', label: 'Active' },
                    { value: 'false', label: 'Inactive' },
                  ]}
                />
              </Fieldset.Content>
            </Fieldset>

            <Fieldset>
              <Fieldset.Legend>Content</Fieldset.Legend>
              <Fieldset.Content>
                <textarea
                  className="prompt-textarea"
                  value={form.content}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, content: event.target.value }))
                  }
                  rows={10}
                />
              </Fieldset.Content>
            </Fieldset>
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            {saving ? 'Saving...' : 'Save prompt'}
          </Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} size="sm">
        <Dialog.Header>
          <h2>Delete prompt</h2>
        </Dialog.Header>
        <Dialog.Body>
          <p>
            Delete "{confirmDelete?.name}"? Active prompts must be disabled
            before deletion.
          </p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog>
    </section>
  )
}

export default AdminPrompts
