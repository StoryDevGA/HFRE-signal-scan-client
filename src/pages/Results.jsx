import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner.jsx'
import { ApiError } from '../lib/api.js'
import { getPublicResult } from '../services/publicResults.js'

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

function Results() {
  const { publicId } = useParams()
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState(null)

  const timestamp = useMemo(
    () => formatTimestamp(result?.createdAt),
    [result?.createdAt]
  )

  useEffect(() => {
    let isActive = true
    setStatus('loading')
    setErrorMessage('')
    setResult(null)

    getPublicResult(publicId)
      .then((data) => {
        if (!isActive) return
        setResult(data)
        setStatus('ready')
      })
      .catch((error) => {
        if (!isActive) return
        if (error instanceof ApiError && error.status === 404) {
          setStatus('not-found')
          return
        }
        setErrorMessage(
          error?.message || 'Unable to load the report right now.'
        )
        setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [publicId])

  if (status === 'loading') {
    return (
      <main className="page container" aria-busy="true">
        <div className="status-block" role="status" aria-live="polite">
          <Spinner type="circle" size="lg" />
          <p className="text-responsive-base">Loading your report...</p>
          <p className="text-responsive-sm text-tertiary">
            This may take a few moments
          </p>
        </div>
      </main>
    )
  }

  if (status === 'not-found') {
    return (
      <main className="page container">
        <div className="error-state" role="alert" aria-live="assertive">
          <div className="error-state__icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-responsive-xl">Report not found</h1>
          <p className="text-responsive-base text-secondary">
            This report link is invalid or may have expired. Please check the URL and try again.
          </p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    const handleRetry = () => {
      window.location.reload()
    }

    return (
      <main className="page container">
        <div className="error-state" role="alert" aria-live="assertive">
          <div className="error-state__icon error-state__icon--error" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-responsive-xl">Unable to load report</h1>
          <p className="text-responsive-base text-secondary">
            {errorMessage}
          </p>
          <button onClick={handleRetry} className="retry-button">
            Try again
          </button>
        </div>
      </main>
    )
  }

  const confidenceLevel = result?.metadata?.confidence_level || 'Unspecified'
  const confidenceBadgeClass = getConfidenceBadgeClass(confidenceLevel)
  const hasReport = result?.customer_report?.trim()

  return (
    <main className="page container">
      <header className="page__header">
        <h1 className="text-responsive-xl">{result?.company || 'Report'}</h1>

        <div className="header-meta">
          <div
            className={`confidence-badge ${confidenceBadgeClass}`}
            role="status"
            aria-label={`Confidence level: ${confidenceLevel}`}
          >
            <span className="confidence-badge__indicator" aria-hidden="true" />
            <span>Confidence: {confidenceLevel}</span>
          </div>

          {timestamp && (
            <time
              className="text-responsive-sm text-tertiary"
              dateTime={result?.createdAt}
            >
              Generated {timestamp}
            </time>
          )}
        </div>
      </header>

      <section className="report" aria-labelledby="report-heading">
        <h2 id="report-heading" className="text-responsive-lg">Customer report</h2>
        {hasReport ? (
          <div className="report__body">{result.customer_report}</div>
        ) : (
          <div className="empty-state">
            <p className="text-secondary text-italic">
              No report content available.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Results