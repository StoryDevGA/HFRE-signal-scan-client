import { useEffect, useMemo, useState } from 'react'
import { ApiError } from '../../../lib/api.js'
import {
  getAdminAnalyticsDetail,
  getAdminAnalyticsSummary,
} from '../../../services/adminAnalytics.js'
import { buildAdminAnalyticsViewModel } from './selectors/index.js'
import ChartErrorBoundary from './components/ChartErrorBoundary.jsx'
import LatencyCard from './components/LatencyCard.jsx'
import StatusSummaryCard from './components/StatusSummaryCard.jsx'
import TokenUsageCard from './components/TokenUsageCard.jsx'
import useChartSize from './hooks/useChartSize.js'
import CountsLatencySection from './sections/CountsLatencySection.jsx'
import FailuresSection from './sections/FailuresSection.jsx'
import PromptPerformanceSection from './sections/PromptPerformanceSection.jsx'
import RetriesSection from './sections/RetriesSection.jsx'
import SubmissionLookupSection from './sections/SubmissionLookupSection.jsx'
import TopClientsSection from './sections/TopClientsSection.jsx'
import UsageByVersionSection from './sections/UsageByVersionSection.jsx'
import { makeCountUpRenderers } from './utils/countUp.jsx'
import './Insights.css'

function AdminAnalytics() {
  const [summary, setSummary] = useState(null)
  const [hasAnimatedTotals, setHasAnimatedTotals] = useState(false)
  const [detailId, setDetailId] = useState('')
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [totalsChartRef, totalsChartSize] = useChartSize()
  const [tokenChartRef, tokenChartSize] = useChartSize()
  const [latencyChartRef, latencyChartSize] = useChartSize()

  useEffect(() => {
    let isActive = true
    setLoading(true)
    setErrorMessage('')

    getAdminAnalyticsSummary()
      .then((data) => {
        if (!isActive) return
        setSummary(data)
      })
      .catch((error) => {
        if (!isActive) return
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setErrorMessage('Please sign in again to view analytics.')
          return
        }
        setErrorMessage(error?.message || 'Unable to load analytics.')
      })
      .finally(() => {
        if (!isActive) return
        setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (summary && !hasAnimatedTotals) {
      setHasAnimatedTotals(true)
    }
  }, [summary, hasAnimatedTotals])

  const loadDetail = async () => {
    if (!detailId.trim()) return
    try {
      const data = await getAdminAnalyticsDetail(detailId.trim())
      setDetail(data)
    } catch (error) {
      setDetail(null)
      setErrorMessage(error?.message || 'Unable to load analytics detail.')
    }
  }

  const analyticsView = useMemo(
    () => buildAdminAnalyticsViewModel(summary),
    [summary]
  )
  const {
    countsByDay,
    topBrowsers,
    topDevices,
    topReferrers,
    topCountries,
    usage,
    usageBySystemVersion,
    usageByUserVersion,
    completeRate,
    failedRate,
    latency,
    latencyByDay,
    latencyLineData,
    hasLatencyLineChart,
    topFailures,
    failureByPromptVersion,
    failureRate,
    performanceByPair,
    performanceBySystem,
    performanceByUser,
    totalRetries,
    retrySuccessRate,
    retriesPerDay,
    totalsChartData,
    hasTotalsChart,
    totalsDisplayValue,
    tokenUsageRadialData,
    hasTokenUsageRadialChart,
    hasTokenUsageTotalSeries,
  } = analyticsView

  const shouldAnimateTotals = Boolean(summary && !hasAnimatedTotals)
  const { renderCount, renderCompactCount, renderPercent } =
    makeCountUpRenderers(shouldAnimateTotals)
  const totalsChartDimension = Math.min(
    totalsChartSize.width,
    totalsChartSize.height || totalsChartSize.width
  )
  const tokenChartWidth = tokenChartSize.width
  const tokenChartHeight = tokenChartSize.height || tokenChartSize.width
  const tokenChartHasSize = tokenChartWidth > 0 && tokenChartHeight > 0
  const latencyChartWidth = latencyChartSize.width || 220
  const latencyChartHeight = latencyChartSize.height || 220
  const showLatencySpinner = loading && !hasLatencyLineChart
  const hasTokenUsageChart = hasTokenUsageRadialChart
  const tokenCenterValue = hasTokenUsageTotalSeries
    ? usage.totalTokens
    : usage.averageTotalTokens
  const tokenCenterLabel = hasTokenUsageTotalSeries ? 'Total' : 'Avg total'
  const tokenUsagePills = [
    {
      label: 'Submissions with usage',
      value: usage.submissionsWithUsage,
      variant: 'primary',
    },
  ]
  const latencyPills = [
    { label: 'P50', value: latency.p50, variant: 'info' },
    { label: 'P90', value: latency.p90, variant: 'warning' },
  ]

  return (
    <section className="admin-section">
      <header className="page__header">
        <h1 className="text-responsive-lg text-uppercase">Analytics</h1>
        <p className="text-responsive-base">
          Monitor submission volume and client device trends.
        </p>
      </header>

      {errorMessage ? <p className="text-responsive-base">{errorMessage}</p> : null}

      <div className="detail-grid">
        <ChartErrorBoundary fallbackMessage="Status chart failed to load">
          <StatusSummaryCard
            totalsChartRef={totalsChartRef}
            totalsChartDimension={totalsChartDimension}
            hasTotalsChart={hasTotalsChart}
            totalsChartData={totalsChartData}
            totalsDisplayValue={totalsDisplayValue}
            renderCompactCount={renderCompactCount}
            completeRate={completeRate}
            failedRate={failedRate}
            renderPercent={renderPercent}
          />
        </ChartErrorBoundary>
        <ChartErrorBoundary fallbackMessage="Token usage chart failed to load">
          <TokenUsageCard
            tokenChartRef={tokenChartRef}
            tokenChartWidth={tokenChartWidth}
            tokenChartHeight={tokenChartHeight}
            tokenChartHasSize={tokenChartHasSize}
            hasTokenUsageChart={hasTokenUsageChart}
            tokenUsageRadialData={tokenUsageRadialData}
            tokenCenterValue={tokenCenterValue}
            tokenCenterLabel={tokenCenterLabel}
            tokenUsagePills={tokenUsagePills}
            renderCompactCount={renderCompactCount}
          />
        </ChartErrorBoundary>
        <ChartErrorBoundary fallbackMessage="Latency chart failed to load">
          <LatencyCard
            latencyChartRef={latencyChartRef}
            showLatencySpinner={showLatencySpinner}
            hasLatencyLineChart={hasLatencyLineChart}
            latencyLineData={latencyLineData}
            latencyChartWidth={latencyChartWidth}
            latencyChartHeight={latencyChartHeight}
            renderCount={renderCount}
            latency={latency}
            latencyPills={latencyPills}
          />
        </ChartErrorBoundary>
      </div>

      <UsageByVersionSection
        usageBySystemVersion={usageBySystemVersion}
        usageByUserVersion={usageByUserVersion}
        loading={loading}
      />

      <CountsLatencySection
        countsByDay={countsByDay}
        latencyByDay={latencyByDay}
        loading={loading}
      />

      <RetriesSection
        totalRetries={totalRetries}
        retrySuccessRate={retrySuccessRate}
        retriesPerDay={retriesPerDay}
        renderCount={renderCount}
        renderPercent={renderPercent}
        loading={loading}
      />

      <TopClientsSection
        topBrowsers={topBrowsers}
        topDevices={topDevices}
        topReferrers={topReferrers}
        topCountries={topCountries}
        loading={loading}
      />

      <FailuresSection
        failureRate={failureRate}
        topFailures={topFailures}
        failureByPromptVersion={failureByPromptVersion}
        renderPercent={renderPercent}
        loading={loading}
      />

      <PromptPerformanceSection
        performanceByPair={performanceByPair}
        performanceBySystem={performanceBySystem}
        performanceByUser={performanceByUser}
        loading={loading}
      />

      <SubmissionLookupSection
        detailId={detailId}
        setDetailId={setDetailId}
        loadDetail={loadDetail}
        detail={detail}
      />
    </section>
  )
}

export default AdminAnalytics
