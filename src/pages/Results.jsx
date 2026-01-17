import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button/Button.jsx'
import Header from '../components/Header/Header.jsx'
import Link from '../components/Link/Link.jsx'
import Spinner from '../components/Spinner/Spinner.jsx'
import Typewriter from '../components/Typewriter/Typewriter.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { getPublicResult } from '../services/publicResults.js'
import storylineLogo from '../assets/images/storylineOS-Logo.png'

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
    let timeoutId

    const pollResult = async () => {
      setErrorMessage('')
      try {
        const data = await getPublicResult(publicId)
        if (!isActive) return

        if (data?.status === 'pending') {
          setStatus('pending')
          timeoutId = window.setTimeout(pollResult, 1500)
          return
        }

        if (data?.status === 'not_found') {
          setStatus('not-found')
          return
        }

        if (data?.status === 'failed') {
          setErrorMessage('The report failed to generate. Please try again later.')
          setStatus('error')
          return
        }

        setResult(data)
        setStatus('ready')
      } catch (error) {
        if (!isActive) return
        setErrorMessage(
          error?.message || 'Unable to load the report right now.'
        )
        setStatus('error')
      }
    }

    setStatus('loading')
    setResult(null)
    pollResult()

    return () => {
      isActive = false
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [publicId])

  const header = (
    <Header
      logo={
        <img src={storylineLogo} alt="StorylineOS" className="home__brand-logo" />
      }
      logoLink={null}
      showNavigation={false}
    >
      <Link href="https://www.storylineos.com/" openInNewTab>
        Back to StorylineOS
      </Link>
    </Header>
  )

  if (status === 'loading' || status === 'pending') {
    return (
      <>
        {header}
        <main className="page container" aria-busy="true">
          <div className="status-block" role="status" aria-live="polite">
            <Spinner type="circle" size="lg" />
            <Typewriter
              text={
                status === 'pending'
                  ? 'We are generating your report...'
                  : 'Loading your report...'
              }
              speed={40}
              className="text-responsive-base"
              ariaLabel="Loading your report"
            />
            <p className="text-responsive-sm text-tertiary">
              This may take a few moments
            </p>
          </div>
        </main>
        <Footer copyright="StorylineOS" />
      </>
    )
  }

  if (status === 'not-found') {
    return (
      <>
        {header}
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
        <Footer copyright="StorylineOS" />
      </>
    )
  }

  if (status === 'error') {
    const handleRetry = () => {
      window.location.reload()
    }

    return (
      <>
        {header}
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
            <Button variant="secondary" onClick={handleRetry}>
              Try again
            </Button>
          </div>
        </main>
        <Footer copyright="StorylineOS" />
      </>
    )
  }

  const confidenceLevel = result?.metadata?.confidence_level || 'Unspecified'
  const confidenceBadgeClass = getConfidenceBadgeClass(confidenceLevel)
  const hasReport = result?.customer_report?.trim()

  return (
    <>
      {header}
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
      <Footer copyright="StorylineOS" />
    </>
  )
}

export default Results
