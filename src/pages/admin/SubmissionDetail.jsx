import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import Card from '../../components/Card/Card.jsx'
import Dialog from '../../components/Dialog/Dialog.jsx'
import ReportRenderer from '../../components/ReportRenderer.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'
import TabView from '../../components/TabView/TabView.jsx'
import Tooltip from '../../components/Tooltip/Tooltip.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import { ApiError } from '../../lib/api.js'
import {
  deleteAdminSubmission,
  getAdminSubmissionDetail,
} from '../../services/adminSubmissionDetail.js'
import { deleteAdminUser } from '../../services/adminUsers.js'

const formatTimestamp = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const normalizeUsage = (usage) => {
  if (!usage || typeof usage !== 'object') return null
  const promptTokens =
    usage.promptTokens ??
    usage.prompt_tokens ??
    usage.input_tokens ??
    usage.inputTokens ??
    null
  const completionTokens =
    usage.completionTokens ??
    usage.completion_tokens ??
    usage.output_tokens ??
    usage.outputTokens ??
    null
  const totalTokens =
    usage.totalTokens ??
    usage.total_tokens ??
    (Number(promptTokens || 0) + Number(completionTokens || 0) || null)

  if (promptTokens == null && completionTokens == null && totalTokens == null) {
    return null
  }

  return {
    promptTokens: Number(promptTokens || 0),
    completionTokens: Number(completionTokens || 0),
    totalTokens: Number(totalTokens || 0),
  }
}

function AdminSubmissionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToaster()
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [submission, setSubmission] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [failureMessage, setFailureMessage] = useState('')
  const [llmModelUsed, setLlmModelUsed] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isActive = true
    setStatus('loading')
    setErrorMessage('')
    setFailureMessage('')

    getAdminSubmissionDetail(id)
      .then((data) => {
        if (!isActive) return
        setSubmission(data?.submission || null)
        setAnalytics(data?.analytics || null)
        setFailureMessage(data?.failureMessage || '')
        setLlmModelUsed(data?.llmModelUsed || '')
        setStatus('ready')
      })
      .catch((error) => {
        if (!isActive) return
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          navigate('/admin/login', { replace: true })
          return
        }
        setErrorMessage(error?.message || 'Unable to load submission.')
        setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [id, navigate])

  const detail = useMemo(() => {
    if (!submission) {
      return {
        inputs: {},
        outputs: {},
        emailStatus: {},
        metadata: {},
        createdAt: '',
        status: '',
        usage: null,
        llmModel: '',
      }
    }
    return {
      inputs: submission.inputs || {},
      outputs: submission.outputs || {},
      emailStatus: submission.emailStatus || {},
      metadata: submission.outputs?.metadata || submission.metadata || {},
      createdAt: submission.createdAt || '',
      status: submission.status || '',
      usage: normalizeUsage(submission.usage),
      llmModel: llmModelUsed || submission.processing?.llmModel || '',
    }
  }, [llmModelUsed, submission])

  const openConfirm = (action) => {
    setConfirmAction(action)
  }

  const closeConfirm = () => {
    if (!isDeleting) {
      setConfirmAction(null)
    }
  }

  const handleConfirm = async () => {
    if (!confirmAction || isDeleting) return
    setIsDeleting(true)
    try {
      if (confirmAction === 'submission') {
        await deleteAdminSubmission(id)
        addToast({
          title: 'Submission deleted',
          description: 'The submission has been removed.',
          variant: 'success',
        })
        navigate('/admin/submissions', { replace: true })
        return
      }
      if (confirmAction === 'user' && detail.inputs.email) {
        await deleteAdminUser(detail.inputs.email)
        addToast({
          title: 'User data deleted',
          description: 'All submissions for this user were removed.',
          variant: 'success',
        })
        navigate('/admin/submissions', { replace: true })
      }
    } catch (error) {
      addToast({
        title: 'Delete failed',
        description: error?.message || 'Unable to delete the record.',
        variant: 'error',
      })
    } finally {
      setIsDeleting(false)
      setConfirmAction(null)
    }
  }

  if (status === 'loading') {
    return (
      <main className="page">
        <div className="status-block status-block--plain">
          <Spinner type="circle" size="lg" />
          <p className="text-responsive-base">Loading submission...</p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="page">
        <header className="page__header">
          <h1 className="text-responsive-lg text-uppercase">Unable to load submission</h1>
          <p className="text-responsive-base">{errorMessage}</p>
        </header>
      </main>
    )
  }

  return (
    <section className="admin-section">
      <header className="page__header">
          <h1 className="text-responsive-lg text-uppercase">
            {detail.inputs.company_name || 'Submission detail'}
          </h1>
        <p className="text-responsive-base">
          Status:{' '}
          <span
            className={`admin-status ${
              detail.status?.toLowerCase() === 'complete'
                ? 'admin-status--active'
                : detail.status?.toLowerCase() === 'failed'
                  ? 'admin-status--failed'
                  : detail.status?.toLowerCase() === 'pending'
                    ? 'admin-status--pending'
                    : 'admin-status--inactive'
            }`}
          >
            {detail.status || 'unknown'}
          </span>
        </p>
        {detail.llmModel ? (
          <p className="text-responsive-sm text-secondary">
            LLM model: {detail.llmModel}
          </p>
        ) : null}
        {detail.usage ? (
          <p className="text-responsive-sm text-secondary">
            Usage: {detail.usage.totalTokens} tokens (prompt {detail.usage.promptTokens}, completion {detail.usage.completionTokens})
          </p>
        ) : null}
        {failureMessage ? (
          <p className="text-responsive-sm text-secondary">
            Failure: {failureMessage}
          </p>
        ) : null}
        {detail.createdAt ? (
          <p className="text-responsive-sm">
            Created: {formatTimestamp(detail.createdAt)}
          </p>
        ) : null}
      </header>

      <div className="detail-actions">
        <Tooltip content="Deletes this submission and its analytics record.">
          <Button
            variant="danger"
            onClick={() => openConfirm('submission')}
            disabled={isDeleting}
            size="xs"
          >
            Delete submission
          </Button>
        </Tooltip>
        <Button
          variant="outline"
          onClick={() => openConfirm('user')}
          disabled={!detail.inputs.email || isDeleting}
          size="xs"
        >
          Delete user data
        </Button>
      </div>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Inputs</h2>
          <dl className="detail-list">
            <div>
              <dt>Contact name</dt>
              <dd>{detail.inputs.name || '-'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{detail.inputs.email || '-'}</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>{detail.inputs.company_name || '-'}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>{detail.inputs.homepage_url || '-'}</dd>
            </div>
            <div>
              <dt>Product</dt>
              <dd>{detail.inputs.product_name || '-'}</dd>
            </div>
            <div>
              <dt>Product page</dt>
              <dd>{detail.inputs.product_page_url || '-'}</dd>
            </div>
          </dl>
        </Card>

        <Card className="detail-card">
          <h2 className="detail-title">Outputs</h2>
          <dl className="detail-list">
            <div>
              <dt>Company</dt>
              <dd>{detail.outputs.company || '-'}</dd>
            </div>
            <div>
              <dt>Confidence</dt>
              <dd>{detail.metadata.confidence_level || '-'}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="detail-card">
        <h2 className="detail-title">Reports</h2>
        <TabView variant="boxed">
          <TabView.Tab label="Customer report">
            <ReportRenderer report={detail.outputs.customer_report} />
          </TabView.Tab>
          <TabView.Tab label="Internal report">
            <ReportRenderer report={detail.outputs.internal_report} />
          </TabView.Tab>
        </TabView>
      </Card>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Email status</h2>
          <dl className="detail-list">
            <div>
              <dt>Customer sent</dt>
              <dd>{formatTimestamp(detail.emailStatus.customerSentAt) || '-'}</dd>
            </div>
            <div>
              <dt>Owner sent</dt>
              <dd>{formatTimestamp(detail.emailStatus.ownerSentAt) || '-'}</dd>
            </div>
            <div>
              <dt>Last error</dt>
              <dd>{detail.emailStatus.lastError || '-'}</dd>
            </div>
          </dl>
        </Card>

        <Card className="detail-card">
          <h2 className="detail-title">Analytics</h2>
          <dl className="detail-list">
            <div>
              <dt>IP address</dt>
              <dd>{analytics?.ipAddress || '-'}</dd>
            </div>
            <div>
              <dt>User agent</dt>
              <dd>{analytics?.userAgent || '-'}</dd>
            </div>
            <div>
              <dt>Accept-Language</dt>
              <dd>{analytics?.acceptLanguage || '-'}</dd>
            </div>
            <div>
              <dt>Referrer</dt>
              <dd>{analytics?.referrer || '-'}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Dialog open={Boolean(confirmAction)} onClose={closeConfirm} size="sm">
        <Dialog.Header>
          <h2>Confirm deletion</h2>
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {confirmAction === 'user'
              ? 'Delete this user and all related submissions and analytics?'
              : 'Delete this submission and its analytics record?'}
          </p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={closeConfirm} disabled={isDeleting} size="xs">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={isDeleting} size="xs">
            {isDeleting ? 'Deleting...' : 'Confirm delete'}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </section>
  )
}

export default AdminSubmissionDetail
