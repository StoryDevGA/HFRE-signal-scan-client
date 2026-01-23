import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Dialog from '../../components/Dialog/Dialog.jsx'
import Fieldset from '../../components/Fieldset/Fieldset.jsx'
import HorizontalScroll from '../../components/HorizontalScroll/HorizontalScroll.jsx'
import Input from '../../components/Input/Input.jsx'
import Select from '../../components/Select/Select.jsx'
import Table from '../../components/Table/Table.jsx'
import Tooltip from '../../components/Tooltip/Tooltip.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import { ApiError, api } from '../../lib/api.js'
import {
  createAdminPrompt,
  deleteAdminPrompt,
  getAdminPrompts,
  publishAdminPrompt,
  updateAdminPrompt,
} from '../../services/adminPrompts.js'

const typeOptions = [
  { value: 'system', label: 'System' },
  { value: 'user', label: 'User' },
]

const MAX_PROMPTS_PER_TYPE = 4
const emptyForm = {
  id: null,
  label: '',
  type: 'system',
  content: '',
  isPublished: false,
  version: '',
}

function normalizePrompts(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.prompts)) return payload.prompts
  return []
}

function normalizeEmail(value) {
  return (value || '').trim().toLowerCase()
}

function getPromptId(prompt) {
  return prompt?._id || prompt?.id
}

function getPromptLabel(prompt) {
  return prompt?.label || prompt?.name || '-'
}

function isPromptPublished(prompt) {
  return Boolean(prompt?.isPublished || prompt?.isActive)
}

function isPromptLocked(prompt) {
  return Boolean(prompt?.isLocked)
}

function formatTimestamp(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

function formatVersion(value) {
  if (value === null || value === undefined) return '-'
  if (Number.isNaN(Number(value))) return '-'
  return Number(value).toFixed(1)
}

function extractAdminEmail(payload) {
  return (
    payload?.email ||
    payload?.user?.email ||
    payload?.admin?.email ||
    payload?.profile?.email ||
    payload?.data?.email ||
    ''
  )
}

function AdminPrompts() {
  const { addToast } = useToaster()
  const [adminEmail, setAdminEmail] = useState('')
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmPublish, setConfirmPublish] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [labelTouched, setLabelTouched] = useState(false)
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
    let isActive = true

    const loadAdminIdentity = async () => {
      try {
        const response = await api.get('/api/admin/auth/me', {
          credentials: 'include',
        })
        const email = extractAdminEmail(response)
        if (email && isActive) {
          setAdminEmail(email)
        }
      } catch (error) {
        // No fallback; rely on /api/admin/auth/me.
      }
    }

    loadAdminIdentity()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    loadPrompts()
  }, [])

  const normalizedAdminEmail = useMemo(
    () => normalizeEmail(adminEmail),
    [adminEmail]
  )

  const ownedPromptCounts = useMemo(() => {
    const counts = { system: 0, user: 0 }
    if (!normalizedAdminEmail) return counts
    prompts.forEach((prompt) => {
      if (normalizeEmail(prompt.ownerEmail) !== normalizedAdminEmail) return
      if (prompt.type === 'system') counts.system += 1
      if (prompt.type === 'user') counts.user += 1
    })
    return counts
  }, [prompts, normalizedAdminEmail])

  const remainingByType = useMemo(
    () => ({
      system: Math.max(0, MAX_PROMPTS_PER_TYPE - ownedPromptCounts.system),
      user: Math.max(0, MAX_PROMPTS_PER_TYPE - ownedPromptCounts.user),
    }),
    [ownedPromptCounts]
  )

  const isSystemAtLimit = ownedPromptCounts.system >= MAX_PROMPTS_PER_TYPE
  const isUserAtLimit = ownedPromptCounts.user >= MAX_PROMPTS_PER_TYPE
  const canCreatePrompt = !(isSystemAtLimit && isUserAtLimit)

  const availableTypeOptions = useMemo(
    () =>
      typeOptions.filter((option) => {
        if (option.value === 'system') return !isSystemAtLimit
        if (option.value === 'user') return !isUserAtLimit
        return true
      }),
    [isSystemAtLimit, isUserAtLimit]
  )

  const typeHelperText = useMemo(() => {
    if (isSystemAtLimit && !isUserAtLimit) {
      return 'System prompt limit reached.'
    }
    if (isUserAtLimit && !isSystemAtLimit) {
      return 'User prompt limit reached.'
    }
    return `Up to ${MAX_PROMPTS_PER_TYPE} prompts per type.`
  }, [isSystemAtLimit, isUserAtLimit])

  const tooltipMessage =
    isSystemAtLimit && isUserAtLimit
      ? `You already have ${MAX_PROMPTS_PER_TYPE} system and ${MAX_PROMPTS_PER_TYPE} user prompts.`
      : 'Add a new prompt.'

  const isLabelValid = Boolean(form.label.trim())
  const isContentValid = Boolean(form.content.trim())
  const showLabelError = labelTouched && !isLabelValid

  const startCreate = () => {
    const defaultType = availableTypeOptions[0]?.value || 'system'
    setForm({ ...emptyForm, type: defaultType })
    setLabelTouched(false)
    setDialogOpen(true)
  }

  const startEdit = (prompt) => {
    if (isPromptLocked(prompt)) {
      addToast({
        title: 'Prompt locked',
        description: prompt?.lockNote || 'This prompt is locked and cannot be edited.',
        variant: 'warning',
      })
      return
    }
    setForm({
      id: getPromptId(prompt),
      label: getPromptLabel(prompt),
      type: prompt.type || 'system',
      content: prompt.content || '',
      isPublished: isPromptPublished(prompt),
      version: prompt.version ?? '',
    })
    setLabelTouched(false)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.label.trim() || !form.content.trim()) {
      setLabelTouched(true)
      addToast({
        title: 'Missing fields',
        description: 'Label and content are required.',
        variant: 'warning',
      })
      return
    }

    setSaving(true)
    try {
      if (form.id) {
        const payload = {
          label: form.label.trim(),
          content: form.content.trim(),
        }
        await updateAdminPrompt(form.id, payload)
        addToast({
          title: 'Prompt updated',
          description: 'Your changes have been saved.',
          variant: 'success',
        })
      } else {
        const payload = {
          type: form.type,
          label: form.label.trim(),
          content: form.content.trim(),
          ...(form.isPublished ? { isPublished: true } : {}),
        }
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
      if (error instanceof ApiError && error.status === 409) {
        addToast({
          title: 'Prompt limit reached',
          description:
            error?.message ||
            `Each admin can create up to ${MAX_PROMPTS_PER_TYPE} prompts per type.`,
          variant: 'warning',
        })
        return
      }
      if (error instanceof ApiError && error.status === 403) {
        addToast({
          title: 'Permission denied',
          description: 'Only the owner can edit this prompt.',
          variant: 'warning',
        })
        return
      }
      if (error instanceof ApiError && error.status === 423) {
        addToast({
          title: 'Prompt locked',
          description: 'This prompt is locked and cannot be edited.',
          variant: 'warning',
        })
        return
      }
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
    const isOwner =
      normalizedAdminEmail &&
      normalizeEmail(prompt?.ownerEmail) === normalizedAdminEmail
    if (!isOwner) {
      addToast({
        title: 'Permission denied',
        description: 'Only the owner can delete this prompt.',
        variant: 'warning',
      })
      return
    }
    if (isPromptPublished(prompt)) {
      addToast({
        title: 'Cannot delete published prompt',
        description: 'Publish another prompt before deleting this one.',
        variant: 'warning',
      })
      return
    }
    if (isPromptLocked(prompt)) {
      addToast({
        title: 'Prompt locked',
        description: prompt?.lockNote || 'This prompt is locked and cannot be deleted.',
        variant: 'warning',
      })
      return
    }
    setConfirmDelete(prompt)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteAdminPrompt(getPromptId(confirmDelete))
      addToast({
        title: 'Prompt deleted',
        description: 'The prompt has been removed.',
        variant: 'success',
      })
      setConfirmDelete(null)
      await loadPrompts()
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        addToast({
          title: 'Permission denied',
          description: 'Only the owner can delete this prompt.',
          variant: 'warning',
        })
        return
      }
      if (error instanceof ApiError && error.status === 423) {
        addToast({
          title: 'Prompt locked',
          description: 'This prompt is locked and cannot be deleted.',
          variant: 'warning',
        })
        return
      }
      addToast({
        title: 'Delete failed',
        description: error?.message || 'Unable to delete the prompt.',
        variant: 'error',
      })
    }
  }

  const handlePublish = async () => {
    if (!confirmPublish) return
    setPublishing(true)
    try {
      await publishAdminPrompt(getPromptId(confirmPublish))
      addToast({
        title: 'Prompt published',
        description: 'The prompt is now active for scans.',
        variant: 'success',
      })
      setConfirmPublish(null)
      await loadPrompts()
    } catch (error) {
      addToast({
        title: 'Publish failed',
        description: error?.message || 'Unable to publish the prompt.',
        variant: 'error',
      })
    } finally {
      setPublishing(false)
    }
  }

  const rows = useMemo(
    () =>
      [...prompts]
        .sort((a, b) => {
          if (a.type !== b.type) {
            if (a.type === 'system') return -1
            if (b.type === 'system') return 1
          }
          const aPublished = isPromptPublished(a)
          const bPublished = isPromptPublished(b)
          if (aPublished !== bPublished) {
            return aPublished ? -1 : 1
          }
          return getPromptLabel(a).localeCompare(getPromptLabel(b))
        })
        .map((prompt) => {
          const ownerEmail = prompt.ownerEmail || ''
          const published = isPromptPublished(prompt)
          const isOwner =
            normalizedAdminEmail &&
            normalizeEmail(ownerEmail) === normalizedAdminEmail
          const locked = isPromptLocked(prompt)
          return {
            id: getPromptId(prompt),
            label: getPromptLabel(prompt),
            type: prompt.type || '',
            ownerEmail: ownerEmail || '-',
            published,
            publishedAt: prompt.publishedAt,
            publishedBy: prompt.publishedBy || '-',
            version: prompt.version ?? '-',
            isOwner,
            isPublished: published,
            isLocked: locked,
            lockNote: prompt.lockNote || '',
            prompt,
          }
        }),
    [prompts, normalizedAdminEmail]
  )

  const renderWithTooltip = (content, child) => {
    if (!content) return child
    return (
      <Tooltip content={content}>
        <span>{child}</span>
      </Tooltip>
    )
  }

  const renderActions = (row) => {
    const prompt = row.prompt
    const isOwner = row.isOwner
    const isPublished = row.isPublished
    const isLocked = row.isLocked
    const lockNote = row.lockNote

    const editButton = (
      <Button
        variant="ghost"
        size="xs"
        disabled={!isOwner || isLocked}
        onClick={() => {
          if (isOwner && !isLocked) startEdit(prompt)
        }}
      >
        Edit
      </Button>
    )

    const deleteDisabled = !isOwner || isPublished || isLocked
    const deleteTooltip = !isOwner
      ? 'Only the owner can delete this prompt.'
      : isPublished
        ? 'Publish another prompt before deleting this one.'
        : isLocked
          ? lockNote || 'This prompt is locked and cannot be deleted.'
        : ''

    const deleteButton = (
      <Button
        variant="danger"
        size="xs"
        disabled={deleteDisabled}
        onClick={() => {
          if (!deleteDisabled) confirmDeletePrompt(prompt)
        }}
      >
        Delete
      </Button>
    )

    return (
      <div className="table__actions">
        {isPublished ? (
          <Button variant="secondary" size="xs" disabled>
            PUBLISHED
          </Button>
        ) : (
          <Button
            variant="primary"
            size="xs"
            onClick={() => setConfirmPublish(prompt)}
          >
            Publish
          </Button>
        )}
        {renderWithTooltip(
          !isOwner
            ? 'Only the owner can edit this prompt.'
            : isLocked
              ? lockNote || 'This prompt is locked and cannot be edited.'
              : '',
          editButton
        )}
        {renderWithTooltip(deleteTooltip, deleteButton)}
      </div>
    )
  }

  return (
    <section className="admin-section">
      <header className="page__header">
        <h1 className="text-responsive-lg">Prompts</h1>
        <p className="text-responsive-base">
          Manage system and user prompts for the scan agent.
        </p>
      </header>

      <div className="admin-actions">
        {canCreatePrompt ? (
          <Button onClick={startCreate} size="xs">New prompt</Button>
        ) : (
          <Tooltip content={tooltipMessage}>
            <span>
              <Button onClick={startCreate} size="xs" disabled>
                New prompt
              </Button>
            </span>
          </Tooltip>
        )}
      </div>

      {errorMessage ? (
        <p className="text-responsive-base">{errorMessage}</p>
      ) : null}

      <HorizontalScroll ariaLabel="Prompts table" className="admin-scroll">
        <Table
          className="admin-table--compact"
          columns={[
            { key: 'label', label: 'LABEL' },
            {
              key: 'type',
              label: 'TYPE',
              render: (value) => (value ? value.toUpperCase() : '-'),
            },
            { key: 'ownerEmail', label: 'OWNER', sortable: true },
            {
              key: 'isLocked',
              label: 'LOCKED',
              render: (value, row) =>
                value ? (
                  <Tooltip content={row.lockNote || 'Locked prompt'}>
                    <span className="admin-status admin-status--inactive">Locked</span>
                  </Tooltip>
                ) : (
                  <span className="admin-status admin-status--active">Open</span>
                ),
            },
            {
              key: 'published',
              label: 'PUBLISHED',
              sortable: true,
              render: (value) => (
                <span
                  className={`admin-status ${
                    value ? 'admin-status--active' : 'admin-status--inactive'
                  }`}
                >
                  {value ? 'Published' : 'Draft'}
                </span>
              ),
            },
            {
              key: 'publishedAt',
              label: 'PUBLISHED AT',
              render: (value) => formatTimestamp(value),
            },
            { key: 'publishedBy', label: 'PUBLISHED BY' },
            {
              key: 'version',
              label: 'VERSION',
              render: (value) => formatVersion(value),
            },
            {
              key: 'actions',
              label: 'ACTIONS',
              render: (_, row) => renderActions(row),
            },
          ]}
          data={rows}
          variant="striped"
          hoverable
          loading={loading}
          emptyMessage="No prompts found."
          ariaLabel="Prompts list"
        />
      </HorizontalScroll>

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
                  id="prompt_label"
                  label="Label"
                  value={form.label}
                  error={showLabelError ? 'Label is required.' : ''}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, label: event.target.value }))
                  }
                  onBlur={() => setLabelTouched(true)}
                  required
                  fullWidth
                />
                {!form.id ? (
                  <>
                    <Select
                      id="prompt_type"
                      label="Type"
                      value={form.type}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, type: event.target.value }))
                      }
                      options={availableTypeOptions.length ? availableTypeOptions : typeOptions}
                      disabled={availableTypeOptions.length === 1}
                      helperText={typeHelperText}
                    />
                    <div className="prompt-limit-badges">
                      <span
                        className={`admin-status ${
                          remainingByType.system > 0
                            ? 'admin-status--active'
                            : 'admin-status--inactive'
                        } ${form.type === 'system' ? 'prompt-limit-badges__item--selected' : ''}`}
                      >
                        SYSTEM: {remainingByType.system} LEFT
                      </span>
                      <span
                        className={`admin-status ${
                          remainingByType.user > 0
                            ? 'admin-status--active'
                            : 'admin-status--inactive'
                        } ${form.type === 'user' ? 'prompt-limit-badges__item--selected' : ''}`}
                      >
                        USER: {remainingByType.user} LEFT
                      </span>
                    </div>
                  </>
                ) : null}
                <Input
                  id="prompt_version"
                  label="Version"
                  value={form.version == null || form.version === '' ? '' : formatVersion(form.version)}
                  placeholder="Auto"
                  helperText="Auto-assigned when content changes."
                  disabled
                />
                {!form.id ? (
                  <Select
                    id="prompt_publish"
                    label="Publish now"
                    value={form.isPublished ? 'true' : 'false'}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        isPublished: event.target.value === 'true',
                      }))
                    }
                    options={[
                      { value: 'false', label: 'Save as draft' },
                      { value: 'true', label: 'Publish now' },
                    ]}
                  />
                ) : null}
              </Fieldset.Content>
            </Fieldset>

            <Fieldset>
              <Fieldset.Legend>
                Content <span className="input-label__required"> *</span>
              </Fieldset.Legend>
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
          <Button variant="secondary" onClick={() => setDialogOpen(false)} size="xs">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={!isLabelValid || !isContentValid}
            size="xs"
          >
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
            Delete "{getPromptLabel(confirmDelete)}"? Published prompts cannot be
            deleted. Publish another prompt first.
          </p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)} size="xs">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} size="xs">
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog open={Boolean(confirmPublish)} onClose={() => setConfirmPublish(null)} size="sm">
        <Dialog.Header>
          <h2>Publish prompt</h2>
        </Dialog.Header>
        <Dialog.Body>
          <p>
            Publish "{getPromptLabel(confirmPublish)}"? This will replace the
            currently published{' '}
            {confirmPublish?.type ? `${confirmPublish.type} prompt` : 'prompt'}.
          </p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={() => setConfirmPublish(null)} size="xs">
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePublish} loading={publishing} size="xs">
            {publishing ? 'Publishing...' : 'Publish'}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </section>
  )
}

export default AdminPrompts
