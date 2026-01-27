import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button/Button.jsx'
import Card from '../components/Card/Card.jsx'
import Fieldset from '../components/Fieldset/Fieldset.jsx'
import Header from '../components/Header/Header.jsx'
import PublicPageHeader from '../components/PublicPageHeader/PublicPageHeader.jsx'
import ReportRenderer from '../components/ReportRenderer.jsx'
import Spinner from '../components/Spinner/Spinner.jsx'
import TabView from '../components/TabView/TabView.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { useToaster } from '../components/Toaster/Toaster.jsx'
import Typewriter from '../components/Typewriter/Typewriter.jsx'
import { getPublicResult } from '../services/publicResults.js'
import storylineLogo from '../assets/images/storylineOS-Logo.png'

/* ===========================
   CONSTANTS
   =========================== */
/**
 * TIP_ROTATION_INTERVAL - How long each tip displays during loading/pending states
 * Allows users enough time to read tips while waiting for reports to generate
 */
const TIP_ROTATION_INTERVAL = 4500 // ms

/**
 * RESULT_POLL_INTERVAL - How often to poll the backend for result updates
 * Balanced between responsiveness and server load
 */
const RESULT_POLL_INTERVAL = 1500 // ms

/**
 * TYPEWRITER_SPEED - Speed of typewriter animation per character
 * Used for the animated tip display during loading states
 */
const TYPEWRITER_SPEED = 40 // ms

/* ===========================
   UTILITY FUNCTIONS
   =========================== */
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
  const { addToast } = useToaster()
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState(null)
  const [tipIndex, setTipIndex] = useState(0)

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
          timeoutId = window.setTimeout(pollResult, RESULT_POLL_INTERVAL)
          return
        }

        if (data?.status === 'not_found') {
          setStatus('not-found')
          return
        }

        if (data?.status === 'failed') {
          const message = data?.message?.trim()
            ? data.message
            : 'The report failed to generate. Please try again later.'
          setErrorMessage(message)
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

    setErrorMessage('')
    setResult(null)
    setTipIndex(0)

    setStatus('loading')
    pollResult()

    return () => {
      isActive = false
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [publicId])

  useEffect(() => {
    if (status !== 'loading' && status !== 'pending') {
      return undefined
    }

    const tipTimer = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
    }, TIP_ROTATION_INTERVAL)

    return () => {
      window.clearInterval(tipTimer)
    }
  }, [status])

  const header = (
    <Header
      logo={
        <img src={storylineLogo} alt="StorylineOS" className="home__brand-logo" />
      }
      logoLink="/"
      showNavigation={false}
    />
  )

  if (status === 'loading' || status === 'pending') {
    const legendText =
      status === 'pending' ? 'Generating report' : 'Loading report'
    return (
      <>
        {header}
        <main className="page container" aria-busy="true">
          <PublicPageHeader />
          <Fieldset>
            <Fieldset.Legend>
              <span className="home__legend">
                <span>{legendText}</span>
              </span>
            </Fieldset.Legend>
            <Fieldset.Content>
              <div className="status-block status-block--plain" role="status" aria-live="polite">
                <Spinner
                  type="circle"
                  size="xl"
                  color="inherit"
                  className="text-tertiary"
                />
                <p className="text-responsive-base">
                  {status === 'pending'
                    ? 'We are generating your report.'
                    : 'Loading your report.'}
                </p>
                <p className="text-responsive-md text-tertiary">
                  <Typewriter
                    key={tipIndex}
                    text={tips[tipIndex]}
                    speed={TYPEWRITER_SPEED}
                    showCursor={false}
                    ariaLabel={tips[tipIndex]}
                  />
                  <span className="loading-ellipsis" aria-hidden="true">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </p>
              </div>
            </Fieldset.Content>
          </Fieldset>
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
          <PublicPageHeader />
          <div className="error-state" role="alert" aria-live="assertive">
            <div className="error-state__icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-responsive-xl">Report not found</h2>
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
          <PublicPageHeader />
          <div className="error-state" role="alert" aria-live="assertive">
            <div className="error-state__icon error-state__icon--error" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-responsive-xl">Unable to load report</h2>
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
  const confidenceIcon = getConfidenceIcon(confidenceLevel)
  const confidenceBadgeClass = getConfidenceBadgeClass(confidenceLevel)
  const hasReport = result?.customer_report?.trim()
  const companyName = result?.company || 'Report'

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      addToast({
        title: 'Link copied',
        description: 'Share the report link with your team.',
        variant: 'success',
      })
    } catch (error) {
      addToast({
        title: 'Copy failed',
        description: 'Unable to copy the link.',
        variant: 'error',
      })
    }
  }

  const handleDownload = () => {
    const reportText = result?.customer_report || 'No report content available.'
    const fileName = `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'report'}-scan.txt`
    const blob = new Blob([reportText], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  return (
    <>
      {header}
      <main className="page container">
        <PublicPageHeader />
        <header className="report-header">
          <div className="report-header__meta">
            <div
              className={`confidence-badge ${confidenceBadgeClass}`}
              role="status"
              aria-label={`Confidence level: ${confidenceLevel}`}
            >
              <span className="confidence-badge__indicator" aria-hidden="true" />
              <span className="confidence-badge__icon" aria-hidden="true">
                {confidenceIcon}
              </span>
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
          <div className="report-header__actions">
            <Button variant="secondary" size="sm" onClick={handleCopyLink}>
              Copy link
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              Download report
            </Button>
          </div>
        </header>

        <Fieldset>
          <Fieldset.Legend>
            <span className="home__legend">
              <span>signal scan customer report</span>
            </span>
          </Fieldset.Legend>
          <Fieldset.Content>
            <Card className="report-card">
              {hasReport ? (
                <TabView>
                  <TabView.Tab label="Overview">
                    <dl className="report-meta">
                      <div>
                        <dt>Confidence</dt>
                        <dd className={`confidence-badge ${confidenceBadgeClass} report-meta__badge`}>
                          <span className="confidence-badge__indicator" aria-hidden="true" />
                          <span className="confidence-badge__icon" aria-hidden="true">
                            {confidenceIcon}
                          </span>
                          <span>{confidenceLevel}</span>
                        </dd>
                      </div>
                      <div>
                        <dt>Scope</dt>
                        <dd>{result?.metadata?.source_scope || 'Public sources'}</dd>
                      </div>
                      <div>
                        <dt>Shareable</dt>
                        <dd>
                          {result?.metadata?.shareability?.customer_safe == null
                            ? 'Unknown'
                            : result.metadata.shareability.customer_safe
                              ? 'Yes'
                              : 'No'}
                        </dd>
                      </div>
                      <div>
                        <dt>Report ID</dt>
                        <dd>{result?.publicId || publicId}</dd>
                      </div>
                    </dl>
                  </TabView.Tab>
                  <TabView.Tab label="Findings">
                    <ReportRenderer report={result.customer_report} />
                  </TabView.Tab>
                  <TabView.Tab label="Raw report">
                    <pre className="report-raw">{result.customer_report}</pre>
                  </TabView.Tab>
                </TabView>
              ) : (
                <div className="empty-state">
                  <p className="text-secondary text-italic">
                    No report content available.
                  </p>
                </div>
              )}
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </main>
      <Footer copyright="StorylineOS" />
    </>
  )
}

const tips = [
  'We analyze only public information',
  'Confidence reflects source consistency',
  'Reports are safe to share externally',
  'You can download this report as text',
]

const getConfidenceIcon = (level) => {
  const normalizedLevel = level?.toLowerCase()
  if (normalizedLevel === 'high') return '++'
  if (normalizedLevel === 'medium') return '+'
  if (normalizedLevel === 'low') return '!'
  return '-'
}

export default Results
