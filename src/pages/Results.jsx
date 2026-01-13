import { useEffect, useMemo, useState } from 'react'
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
    let timeoutId

    const loadResult = async () => {
      try {
        const data = await getPublicResult(publicId)
        if (!isActive) return

        if (data?.status === 'pending') {
          setStatus('pending')
          timeoutId = window.setTimeout(loadResult, POLL_INTERVAL_MS)
          return
        }

        if (data?.status === 'failed') {
          setStatus('failed')
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
    <main className="page container">
      <header className="page__header">
        <h1 className="text-responsive-xl">{result?.company || 'Report'}</h1>
        <p className="text-responsive-base">
          Confidence level: {result?.metadata?.confidence_level || 'Unspecified'}
        </p>
        {timestamp ? (
          <p className="text-responsive-sm">Generated: {timestamp}</p>
        ) : null}
      </header>

      <section className="report">
        <h2 className="text-responsive-lg">Customer report</h2>
        <ReportRenderer report={result?.customer_report} />
      </section>
    </main>
  )
}

export default Results
