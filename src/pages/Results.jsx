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
      <main className="page container">
        <div className="status-block">
          <Spinner type="circle" size="lg" />
          <p className="text-responsive-base">Generating your report...</p>
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
        <div className="report__body">{result?.customer_report}</div>
      </section>
    </main>
  )
}

export default Results
