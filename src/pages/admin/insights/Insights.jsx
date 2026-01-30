import { useEffect, useMemo, useRef, useState } from 'react'
import CountUp from 'react-countup'
import { Pie } from '@nivo/pie'
import { MdInsights, MdToken } from 'react-icons/md'
import Button from '../../../components/Button/Button.jsx'
import Card from '../../../components/Card/Card.jsx'
import Fieldset from '../../../components/Fieldset/Fieldset.jsx'
import HorizontalScroll from '../../../components/HorizontalScroll/HorizontalScroll.jsx'
import Input from '../../../components/Input/Input.jsx'
import Pill from '../../../components/Pill/Pill.jsx'
import Table from '../../../components/Table/Table.jsx'
import { ApiError } from '../../../lib/api.js'
import {
  getAdminAnalyticsDetail,
  getAdminAnalyticsSummary,
} from '../../../services/adminAnalytics.js'
import {
  buildAdminAnalyticsViewModel,
  formatCompactNumber,
  formatDurationMs,
  formatPercent,
  getPercentValue,
} from './insightsSelectors.js'
import './Insights.css'

function AdminAnalytics() {
  const [summary, setSummary] = useState(null)
  const [hasAnimatedTotals, setHasAnimatedTotals] = useState(false)
  const [detailId, setDetailId] = useState('')
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const totalsChartRef = useRef(null)
  const [totalsChartSize, setTotalsChartSize] = useState({ width: 0, height: 0 })

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

  useEffect(() => {
    const element = totalsChartRef.current
    if (!element) return

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect()
      setTotalsChartSize((prev) => {
        const next = {
          width: Math.max(0, Math.floor(width)),
          height: Math.max(0, Math.floor(height)),
        }
        if (prev.width === next.width && prev.height === next.height) {
          return prev
        }
        return next
      })
    }

    updateSize()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }

    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

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
    totals,
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
  } = analyticsView
  const shouldAnimateTotals = Boolean(summary && !hasAnimatedTotals)
  const totalsChartDimension = Math.min(
    totalsChartSize.width,
    totalsChartSize.height || totalsChartSize.width
  )
  const renderCount = (value, options = {}) => (
    <CountUp
      start={shouldAnimateTotals ? 0 : Number(value ?? 0)}
      end={Number(value ?? 0)}
      duration={0.9}
      preserveValue={!shouldAnimateTotals}
      separator=","
      {...options}
    />
  )
  const renderCompactCount = (value, options = {}) => (
    <CountUp
      start={shouldAnimateTotals ? 0 : Number(value ?? 0)}
      end={Number(value ?? 0)}
      duration={0.9}
      preserveValue={!shouldAnimateTotals}
      formattingFn={formatCompactNumber}
      {...options}
    />
  )
  const renderPercent = (value) => (
    <CountUp
      start={shouldAnimateTotals ? 0 : getPercentValue(value)}
      end={getPercentValue(value)}
      duration={0.9}
      preserveValue={!shouldAnimateTotals}
      decimals={0}
      suffix="%"
    />
  )

  return (
    <section className="admin-section">
      <header className="page__header">
        <h1 className="text-responsive-lg text-uppercase">Analytics</h1>
        <p className="text-responsive-base">
          Monitor submission volume and client device trends.
        </p>
      </header>

      {errorMessage ? (
        <p className="text-responsive-base">{errorMessage}</p>
      ) : null}

      <div className="detail-grid">
        <Fieldset>
          <Fieldset.Legend icon={<MdInsights size={14} />}>
            Submission status
          </Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <div className="status-summary">
                <div className="status-chart">
                  <div className="analytics-chart analytics-chart--totals" aria-hidden="true">
                    <div className="analytics-chart__inner" ref={totalsChartRef}>
                      {hasTotalsChart && totalsChartDimension > 0 ? (
                        <Pie
                          data={totalsChartData}
                          width={totalsChartDimension}
                          height={totalsChartDimension}
                          margin={{ top: 8, right: 8, bottom: 36, left: 8 }}
                          innerRadius={0.74}
                          padAngle={0.05}
                          cornerRadius={4}
                          colors={{ datum: 'data.color' }}
                          enableArcLabels={false}
                          enableArcLinkLabels={false}
                          sortByValue={false}
                          legends={[
                            {
                              anchor: 'bottom',
                              direction: 'row',
                              translateY: 28,
                              itemWidth: 80,
                              itemHeight: 18,
                              itemsSpacing: 8,
                              itemTextColor: 'var(--color-text-primary)',
                              symbolSize: 10,
                              symbolShape: 'circle',
                            },
                          ]}
                          theme={{
                            fontFamily: 'var(--font-sans)',
                            textColor: 'var(--color-text-secondary)',
                            tooltip: {
                              container: {
                                background: 'var(--color-surface)',
                                color: 'var(--color-text-primary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 0,
                                boxShadow: 'var(--shadow-sm)',
                                fontSize: '0.85rem',
                              },
                            },
                          }}
                        />
                      ) : (
                        <span className="analytics-chart__empty">No totals yet</span>
                      )}
                    </div>
                  </div>
                  <div className="status-chart__center">
                    <span className="status-chart__total">
                      {renderCompactCount(totalsDisplayValue)}
                    </span>
                    <span className="status-chart__label">Total</span>
                  </div>
                </div>
              </div>
              <div className="status-metrics status-metrics--rates">
                <div className="status-metric">
                  <Pill variant="success" size="sm">
                    <span className="status-pill__label">Success rate</span>
                    <span className="status-pill__value">{renderPercent(completeRate)}</span>
                  </Pill>
                </div>
                <div className="status-metric">
                  <Pill variant="danger" size="sm">
                    <span className="status-pill__label">Failed rate</span>
                    <span className="status-pill__value">{renderPercent(failedRate)}</span>
                  </Pill>
                </div>
              </div>
            </Card>
          </Fieldset.Content>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend icon={<MdToken size={14} />}>Token usage</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <dl className="detail-list">
                <div>
                  <dt>Submissions with usage</dt>
                  <dd>{renderCount(usage.submissionsWithUsage)}</dd>
                </div>
                <div>
                  <dt>Total tokens</dt>
                  <dd>{renderCount(usage.totalTokens)}</dd>
                </div>
                <div>
                  <dt>Avg total</dt>
                  <dd>{renderCount(usage.averageTotalTokens)}</dd>
                </div>
                <div>
                  <dt>Total prompt</dt>
                  <dd>{renderCount(usage.promptTokens)}</dd>
                </div>
                <div>
                  <dt>Total completion</dt>
                  <dd>{renderCount(usage.completionTokens)}</dd>
                </div>
                <div>
                  <dt>Avg prompt</dt>
                  <dd>{renderCount(usage.averagePromptTokens)}</dd>
                </div>
                <div>
                  <dt>Avg completion</dt>
                  <dd>{renderCount(usage.averageCompletionTokens)}</dd>
                </div>
              </dl>
            </Card>
          </Fieldset.Content>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend>Time to complete</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <dl className="detail-list">
                <div>
                  <dt>P50</dt>
                  <dd>{formatDurationMs(latency.p50)}</dd>
                </div>
                <div>
                  <dt>P90</dt>
                  <dd>{formatDurationMs(latency.p90)}</dd>
                </div>
                <div>
                  <dt>P95</dt>
                  <dd>{formatDurationMs(latency.p95)}</dd>
                </div>
                <div>
                  <dt>Max</dt>
                  <dd>{formatDurationMs(latency.max)}</dd>
                </div>
              </dl>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </div>

      <div className="detail-grid">
        <Fieldset>
          <Fieldset.Legend>Token usage by system version</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Token usage by system version table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'version', label: 'VERSION' },
                    { key: 'avgTotalTokens', label: 'AVG TOTAL TOKENS' },
                  ]}
                  data={[...usageBySystemVersion]
                    .sort((a, b) => {
                      const aVersion = a.version ?? Number.POSITIVE_INFINITY
                      const bVersion = b.version ?? Number.POSITIVE_INFINITY
                      return aVersion - bVersion
                    })
                    .map((item) => ({
                      version: item.version ?? '—',
                      avgTotalTokens: Number(item.avgTotalTokens ?? 0).toLocaleString(),
                    }))}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Token usage by system version"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend>Token usage by user version</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Token usage by user version table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'version', label: 'VERSION' },
                    { key: 'avgTotalTokens', label: 'AVG TOTAL TOKENS' },
                  ]}
                  data={[...usageByUserVersion]
                    .sort((a, b) => {
                      const aVersion = a.version ?? Number.POSITIVE_INFINITY
                      const bVersion = b.version ?? Number.POSITIVE_INFINITY
                      return aVersion - bVersion
                    })
                    .map((item) => ({
                      version: item.version ?? '—',
                      avgTotalTokens: Number(item.avgTotalTokens ?? 0).toLocaleString(),
                    }))}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Token usage by user version"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </div>

      <div className="detail-grid">
        <Fieldset>
          <Fieldset.Legend>Counts by day</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Counts by day table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'date', label: 'DATE' },
                    { key: 'total', label: 'TOTAL' },
                    { key: 'pending', label: 'PENDING' },
                    { key: 'complete', label: 'COMPLETE' },
                    { key: 'failed', label: 'FAILED' },
                  ]}
                  data={countsByDay}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Counts by day"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend>Latency by day</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Latency by day table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'date', label: 'DATE' },
                    { key: 'p50', label: 'P50' },
                    { key: 'p90', label: 'P90' },
                  ]}
                  data={latencyByDay}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Latency by day"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </div>

      <div className="detail-grid">
        <Fieldset>
          <Fieldset.Legend>Retry behavior</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <dl className="detail-list">
                <div>
                  <dt>Total retries</dt>
                  <dd>{renderCount(totalRetries)}</dd>
                </div>
                <div>
                  <dt>Retry success rate</dt>
                  <dd>{renderPercent(retrySuccessRate)}</dd>
                </div>
              </dl>
            </Card>
          </Fieldset.Content>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend>Retries by day</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Retries by day table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'date', label: 'DATE' },
                    { key: 'retries', label: 'RETRIES' },
                  ]}
                  data={retriesPerDay.map((item) => ({
                    date: item.date,
                    retries: Number(item.retries ?? 0).toLocaleString(),
                  }))}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Retries by day"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </div>

      <div className="detail-grid">
        <Fieldset>
          <Fieldset.Legend>Top browsers</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Top browsers table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'key', label: 'BROWSER' },
                    { key: 'count', label: 'COUNT' },
                  ]}
                  data={topBrowsers}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Top browsers"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
        <Fieldset>
          <Fieldset.Legend>Top devices</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Top devices table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'key', label: 'DEVICE' },
                    { key: 'count', label: 'COUNT' },
                  ]}
                  data={topDevices}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Top devices"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </div>

      <div className="detail-grid">
        <Fieldset>
          <Fieldset.Legend>Top referrers</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Top referrers table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'key', label: 'REFERRER' },
                    { key: 'count', label: 'COUNT' },
                  ]}
                  data={topReferrers}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Top referrers"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
        <Fieldset>
          <Fieldset.Legend>Top countries</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Top countries table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'key', label: 'COUNTRY' },
                    { key: 'count', label: 'COUNT' },
                  ]}
                  data={topCountries}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Top countries"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </div>

      <div className="detail-grid">
        <Fieldset>
          <Fieldset.Legend>Failure analytics</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <dl className="detail-list">
                <div>
                  <dt>Failure rate</dt>
                  <dd>{renderPercent(failureRate)}</dd>
                </div>
              </dl>
              <HorizontalScroll ariaLabel="Top failures table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'message', label: 'MESSAGE' },
                    { key: 'count', label: 'COUNT' },
                  ]}
                  data={topFailures}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Top failures"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend>Failures by prompt version</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Failures by prompt version table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'systemPromptVersion', label: 'SYSTEM' },
                    { key: 'userPromptVersion', label: 'USER' },
                    { key: 'count', label: 'COUNT' },
                  ]}
                  data={failureByPromptVersion.map((item) => ({
                    systemPromptVersion: item.systemPromptVersion ?? '—',
                    userPromptVersion: item.userPromptVersion ?? '—',
                    count: item.count ?? 0,
                  }))}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Failures by prompt version"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </div>

      <div className="detail-grid">
        <Fieldset>
          <Fieldset.Legend>Prompt performance (pair)</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="Prompt performance by pair table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'systemPromptVersion', label: 'SYSTEM' },
                    { key: 'userPromptVersion', label: 'USER' },
                    { key: 'completeRate', label: 'COMPLETE RATE' },
                    { key: 'avgDurationMs', label: 'AVG DURATION' },
                  ]}
                  data={[...performanceByPair]
                    .sort((a, b) => {
                      const aSystem = a.systemPromptVersion ?? Number.POSITIVE_INFINITY
                      const bSystem = b.systemPromptVersion ?? Number.POSITIVE_INFINITY
                      const aUser = a.userPromptVersion ?? Number.POSITIVE_INFINITY
                      const bUser = b.userPromptVersion ?? Number.POSITIVE_INFINITY
                      if (aSystem !== bSystem) return aSystem - bSystem
                      return aUser - bUser
                    })
                    .map((item) => ({
                      systemPromptVersion: item.systemPromptVersion ?? '—',
                      userPromptVersion: item.userPromptVersion ?? '—',
                      completeRate: formatPercent(item.completeRate),
                      avgDurationMs: formatDurationMs(item.avgDurationMs),
                    }))}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="Prompt performance by pair"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend>System prompt performance</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="System prompt performance table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'version', label: 'VERSION' },
                    { key: 'completeRate', label: 'COMPLETE RATE' },
                    { key: 'avgDurationMs', label: 'AVG DURATION' },
                  ]}
                  data={[...performanceBySystem]
                    .sort((a, b) => {
                      const aVersion = a.version ?? Number.POSITIVE_INFINITY
                      const bVersion = b.version ?? Number.POSITIVE_INFINITY
                      return aVersion - bVersion
                    })
                    .map((item) => ({
                      version: item.version ?? '—',
                      completeRate: formatPercent(item.completeRate),
                      avgDurationMs: formatDurationMs(item.avgDurationMs),
                    }))}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="System prompt performance"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend>User prompt performance</Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <HorizontalScroll ariaLabel="User prompt performance table" className="admin-scroll">
                <Table
                  columns={[
                    { key: 'version', label: 'VERSION' },
                    { key: 'completeRate', label: 'COMPLETE RATE' },
                    { key: 'avgDurationMs', label: 'AVG DURATION' },
                  ]}
                  data={[...performanceByUser]
                    .sort((a, b) => {
                      const aVersion = a.version ?? Number.POSITIVE_INFINITY
                      const bVersion = b.version ?? Number.POSITIVE_INFINITY
                      return aVersion - bVersion
                    })
                    .map((item) => ({
                      version: item.version ?? '—',
                      completeRate: formatPercent(item.completeRate),
                      avgDurationMs: formatDurationMs(item.avgDurationMs),
                    }))}
                  loading={loading}
                  emptyMessage="No data yet."
                  ariaLabel="User prompt performance"
                />
              </HorizontalScroll>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </div>

      <Fieldset>
        <Fieldset.Legend>Submission analytics</Fieldset.Legend>
        <Fieldset.Content>
          <Card className="detail-card">
            <form className="form" onSubmit={(event) => event.preventDefault()}>
              <Fieldset>
                <Fieldset.Legend>Lookup</Fieldset.Legend>
                <Fieldset.Content>
                  <Input
                    id="analytics_submission_id"
                    label="Submission ID"
                    value={detailId}
                    onChange={(event) => setDetailId(event.target.value)}
                    fullWidth
                  />
                  <Button variant="secondary" onClick={loadDetail} type="button" size="xs">
                    Fetch detail
                  </Button>
                </Fieldset.Content>
              </Fieldset>
            </form>

            {detail ? (
              <dl className="detail-list">
                <div>
                  <dt>Submission</dt>
                  <dd>{detail.submissionId || detail.submission || '-'}</dd>
                </div>
                <div>
                  <dt>IP address</dt>
                  <dd>{detail.ipAddress || '-'}</dd>
                </div>
                <div>
                  <dt>User agent</dt>
                  <dd>{detail.userAgent || '-'}</dd>
                </div>
                <div>
                  <dt>Accept-Language</dt>
                  <dd>{detail.acceptLanguage || '-'}</dd>
                </div>
                <div>
                  <dt>Referrer</dt>
                  <dd>{detail.referrer || '-'}</dd>
                </div>
                <div>
                  <dt>Device summary</dt>
                  <dd>{detail.deviceSummary || '-'}</dd>
                </div>
              </dl>
            ) : null}
          </Card>
        </Fieldset.Content>
      </Fieldset>
    </section>
  )
}

export default AdminAnalytics
