import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReportRenderer from '../components/ReportRenderer.jsx'
import Spinner from '../components/Spinner/Spinner.jsx'
import { ApiError } from '../lib/api.js'
import { getPublicResult } from '../services/publicResults.js'

const formatTimestamp = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 30

function Results() {
  const { publicId } = useParams()
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState(null)
  const pollCountRef = useRef(0)

  const timestamp = useMemo(
    () => formatTimestamp(result?.createdAt),
    [result?.createdAt]
  )
  const confidence = result?.metadata?.confidence_level || 'Unspecified'
  const confidenceTone =
    confidence === 'High'
      ? 'high'
      : confidence === 'Medium'
        ? 'medium'
        : confidence === 'Low'
          ? 'low'
          : 'unknown'
  const sourceScope =
    result?.metadata?.source_scope || 'Public website only'

  useEffect(() => {
    let isActive = true
    let timeoutId
    pollCountRef.current = 0

    const loadResult = async () => {
      try {
        const data = await getPublicResult(publicId)
        if (!isActive) return

        if (data?.status === 'pending') {
          setStatus('pending')
          pollCountRef.current += 1
          if (pollCountRef.current > MAX_POLL_ATTEMPTS) {
            setErrorMessage('Report is taking longer than expected.')
            setStatus('error')
            return
          }
          timeoutId = window.setTimeout(loadResult, POLL_INTERVAL_MS)
          return
        }

        if (data?.status === 'failed') {
          setStatus('failed')
          return
        }

        if (data?.status === 'not_found') {
          setStatus('not-found')
          return
        }

        if (data?.status && data.status !== 'complete') {
          setErrorMessage('Unexpected response from server.')
          setStatus('error')
          return
        }

        if (!data?.customer_report) {
          setStatus('pending')
          pollCountRef.current += 1
          if (pollCountRef.current > MAX_POLL_ATTEMPTS) {
            setErrorMessage('Report is taking longer than expected.')
            setStatus('error')
            return
          }
          timeoutId = window.setTimeout(loadResult, POLL_INTERVAL_MS)
          return
        }

        setResult(data)
        setStatus('ready')
      } catch (error) {
        if (!isActive) return
        if (error instanceof ApiError && error.status === 404) {
          setStatus('not-found')
          return
        }
        if (error instanceof ApiError && error.status === 500) {
          setStatus('failed')
          return
        }
        setErrorMessage(
          error?.message || 'Unable to load the report right now.'
        )
        setStatus('error')
      }
    }

    setStatus('loading')
    setErrorMessage('')
    setResult(null)
    loadResult()

    return () => {
      isActive = false
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [publicId])

  if (status === 'loading') {
    return (
      <main className="page container">
        <div className="status-block">
          <Spinner type="circle" size="lg" />
          <p className="text-responsive-base">Generating your report...</p>
        </div>
      </main>
    )
  }

  if (status === 'pending') {
    return (
      <main className="page container">
        <div className="status-block">
          <Spinner type="circle" size="lg" />
          <p className="text-responsive-base">
            Your report is in progress. We are checking for updates.
          </p>
        </div>
      </main>
    )
  }

  if (status === 'not-found') {
    return (
      <main className="page container">
        <header className="page__header">
          <h1 className="text-responsive-xl">Report not found</h1>
          <p className="text-responsive-base">
            This report link is invalid or has expired.
          </p>
        </header>
      </main>
    )
  }

  if (status === 'failed') {
    return (
      <main className="page container">
        <header className="page__header">
          <h1 className="text-responsive-xl">Report failed</h1>
          <p className="text-responsive-base">
            We could not complete this scan. Please try again later.
          </p>
        </header>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="page container">
        <header className="page__header">
          <h1 className="text-responsive-xl">Unable to load report</h1>
          <p className="text-responsive-base">{errorMessage}</p>
        </header>
      </main>
    )
  }

  return (
    <main className="page container results">
      <section className="results__hero">
        <div>
          <p className="results__eyebrow text-responsive-sm">Signal scan report</p>
          <h1 className="text-responsive-xl">{result?.company || 'Report'}</h1>
          <p className="text-responsive-base results__summary">
            A customer-safe signal scan based on public website signals.
          </p>
        </div>
        <div className="results__card">
          <div className="results__meta">
            <div className="results__meta-item">
              <span className="results__meta-label">Confidence</span>
              <span className={`results__confidence results__confidence--${confidenceTone}`}>
                {confidence}
              </span>
            </div>
            <div className="results__meta-item">
              <span className="results__meta-label">Source scope</span>
              <span className="results__meta-value">{sourceScope}</span>
            </div>
            <div className="results__meta-item">
              <span className="results__meta-label">Generated</span>
              <span className="results__meta-value">{timestamp || 'In progress'}</span>
            </div>
          </div>
          <p className="results__note text-responsive-sm">
            A copy is sent to the email provided during submission.
          </p>
        </div>
      </section>

      <section className="report">
        <div className="results__report-header">
          <h2 className="text-responsive-lg">Customer report</h2>
          <p className="text-responsive-sm results__report-subtitle">
            Highlights are formatted for easy sharing.
          </p>
        </div>
        <ReportRenderer report={result?.customer_report} />
      </section>
    </main>
  )
}

export default Results
