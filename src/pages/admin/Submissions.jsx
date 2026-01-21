import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import HorizontalScroll from '../../components/HorizontalScroll/HorizontalScroll.jsx'
import Input from '../../components/Input/Input.jsx'
import Select from '../../components/Select/Select.jsx'
import Table from '../../components/Table/Table.jsx'
import Tooltip from '../../components/Tooltip/Tooltip.jsx'
import { ApiError } from '../../lib/api.js'
import { getAdminSubmissions } from '../../services/adminSubmissions.js'

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'complete', label: 'Complete' },
  { value: 'failed', label: 'Failed' },
]

const formatTimestamp = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const getConfidenceBadgeClass = (level) => {
  const normalizedLevel = level?.toLowerCase()
  switch (normalizedLevel) {
    case 'high':
      return 'confidence-badge--high'
    case 'medium':
      return 'confidence-badge--medium'
    case 'low':
      return 'confidence-badge--low'
    default:
      return 'confidence-badge--default'
  }
}

const getConfidenceIcon = (level) => {
  const normalizedLevel = level?.toLowerCase()
  if (normalizedLevel === 'high') return '++'
  if (normalizedLevel === 'medium') return '+'
  if (normalizedLevel === 'low') return '!'
  return '-'
}

function normalizeSubmissions(payload) {
  if (!payload) {
    return { items: [], page: 1, totalPages: 1 }
  }

  const items =
    payload.submissions ||
    payload.items ||
    payload.data ||
    payload.results ||
    []

  const pagination = payload.pagination || payload.meta || {}
  const page = Number(pagination.page || payload.page || 1)
  const pageSize = Number(pagination.pageSize || payload.pageSize || 10)
  const total = Number(pagination.total || payload.total || items.length)
  const totalPages = Number(
    pagination.totalPages || Math.max(1, Math.ceil(total / pageSize))
  )

  return { items, page, totalPages }
}

function AdminSubmissions() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const columns = useMemo(
    () => [
      { key: 'createdAt', label: 'Created' },
      { key: 'company', label: 'Company' },
      { key: 'email', label: 'Contact Email' },
      { key: 'status', label: 'Status' },
      { key: 'confidence', label: 'Confidence' },
      { key: 'llmModel', label: 'LLM Model' },
    ],
    []
  )

  const fetchSubmissions = async ({ nextPage = page } = {}) => {
    setLoading(true)
    setErrorMessage('')
    try {
      const response = await getAdminSubmissions({
        q: query,
        status,
        page: nextPage,
        pageSize: 10,
      })
      const normalized = normalizeSubmissions(response)
      setData(normalized.items)
      setPage(normalized.page)
      setTotalPages(normalized.totalPages)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        navigate('/admin/login', { replace: true })
        return
      }
      setErrorMessage(error?.message || 'Unable to load submissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions({ nextPage: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rows = data.map((submission) => {
    const statusText = submission.status || ''
    const failureMessage = submission.failureMessage || ''
    const confidence =
      submission.outputs?.metadata?.confidence_level ||
      submission.metadata?.confidence_level ||
      ''
    const confidenceBadgeClass = getConfidenceBadgeClass(confidence)
    const failedStatus = statusText.toLowerCase() === 'failed'
    const llmModel =
      submission.llmModelUsed ||
      submission.processing?.llmModel ||
      ''
    const llmTemperature =
      submission.llmTemperatureUsed ??
      submission.processing?.llmTemperature ??
      null
    const temperatureTag = Number.isFinite(Number(llmTemperature))
      ? ` [${Number(llmTemperature)}]`
      : ''
    const statusBadge = (
      <span className="admin-status admin-status--failed">Failed</span>
    )

    return {
      id: submission._id || submission.id || submission.publicId,
      createdAt: formatTimestamp(submission.createdAt),
      company: submission.inputs?.company_name || submission.company || '',
      email: submission.inputs?.email || submission.email || '',
      status: failedStatus ? (
        failureMessage ? (
          <Tooltip content={failureMessage}>{statusBadge}</Tooltip>
        ) : (
          statusBadge
        )
      ) : (
        statusText
      ),
      confidence: confidence ? (
        <span className={`confidence-badge ${confidenceBadgeClass}`}>
          <span className="confidence-badge__indicator" aria-hidden="true" />
          <span className="confidence-badge__icon" aria-hidden="true">
            {getConfidenceIcon(confidence)}
          </span>
          <span>{confidence}</span>
        </span>
      ) : (
        '—'
      ),
      llmModel: llmModel ? `${llmModel}${temperatureTag}` : '—',
    }
  })

  return (
    <section className="admin-section">
      <header className="page__header">
        <h1 className="text-responsive-lg">Submissions</h1>
        <p className="text-responsive-base">
          Review incoming scans and track completion status.
        </p>
      </header>

      <div className="admin-filters">
        <Input
          id="submission_search"
          label="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          fullWidth
        />
        <Select
          id="submission_status"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={statusOptions}
        />
        <Button
          variant="secondary"
          onClick={() => fetchSubmissions({ nextPage: 1 })}
        >
          Apply filters
        </Button>
      </div>

      {errorMessage ? (
        <p className="text-responsive-base">{errorMessage}</p>
      ) : null}

      <HorizontalScroll ariaLabel="Submissions table" className="admin-scroll">
        <Table
          columns={columns}
          data={rows}
          variant="striped"
          hoverable
          actions={[
            {
              label: 'View',
              variant: 'ghost',
              onClick: (row) => navigate(`/admin/submissions/${row.id}`),
            },
          ]}
          loading={loading}
          emptyMessage="No submissions found."
          ariaLabel="Submissions list"
        />
      </HorizontalScroll>

      <div className="admin-pagination">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1 || loading}
          onClick={() => fetchSubmissions({ nextPage: Math.max(1, page - 1) })}
        >
          Previous
        </Button>
        <span className="text-responsive-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages || loading}
          onClick={() =>
            fetchSubmissions({ nextPage: Math.min(totalPages, page + 1) })
          }
        >
          Next
        </Button>
      </div>
    </section>
  )
}

export default AdminSubmissions
