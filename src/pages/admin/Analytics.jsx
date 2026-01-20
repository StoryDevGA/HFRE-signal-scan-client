import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Card from '../../components/Card/Card.jsx'
import Fieldset from '../../components/Fieldset/Fieldset.jsx'
import HorizontalScroll from '../../components/HorizontalScroll/HorizontalScroll.jsx'
import Input from '../../components/Input/Input.jsx'
import Table from '../../components/Table/Table.jsx'
import { ApiError } from '../../lib/api.js'
import {
  getAdminAnalyticsDetail,
  getAdminAnalyticsSummary,
} from '../../services/adminAnalytics.js'

const formatPercent = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0%'
  const normalized = number > 1 ? number : number * 100
  return `${Math.round(normalized)}%`
}

const formatDurationMs = (value) => {
  const ms = Number(value)
  if (!Number.isFinite(ms)) return '0 ms'
  return `${ms.toLocaleString()} ms`
}

function AdminAnalytics() {
  const [summary, setSummary] = useState(null)
  const [detailId, setDetailId] = useState('')
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

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

  const totals = summary?.totals || {}
  const countsByDay = (summary?.countsByDay || []).map((item) => ({
    date: item.date,
    total: item.total ?? item.count ?? 0,
    pending: item.pending ?? 0,
    complete: item.complete ?? 0,
    failed: item.failed ?? 0,
  }))
  const topBrowsers = summary?.topBrowsers || []
  const topDevices = summary?.topDevices || []
  const topReferrers = summary?.topReferrers || []
  const topCountries = summary?.topCountries || []
  const usage = summary?.usage || {}
  const usageBySystemVersion = usage.bySystemVersion || []
  const usageByUserVersion = usage.byUserVersion || []
  const completeRate = totals.completeRate ?? totals.conversionRate ?? 0
  const failedRate = totals.failedRate ?? 0
  const latency = summary?.latencyMs || {}
  const latencyByDay = (summary?.latencyByDay || []).map((item) => ({
    date: item.date,
    p50: formatDurationMs(item.p50),
    p90: formatDurationMs(item.p90),
  }))
  const failures = summary?.failures || {}
  const topFailures = failures.topFailures || []
  const failureByPromptVersion = failures.failureByPromptVersion || []
  const failureRate = failures.failureRate ?? failedRate
  const promptPerformance = summary?.promptPerformance || {}
  const performanceByPair = promptPerformance.byPair || []
  const performanceBySystem = promptPerformance.bySystemVersion || []
  const performanceByUser = promptPerformance.byUserVersion || []
  const retries = summary?.retries || {}
  const totalRetries = retries.totalRetries ?? 0
  const retrySuccessRate = retries.retrySuccessRate ?? 0
  const retriesPerDay = (retries.retriesPerDay || []).map((item) => ({
    date: item.date ?? item._id,
    retries: item.retries ?? 0,
  }))

  return (
    <section className="admin-section">
      <header className="page__header">
        <h1 className="text-responsive-lg">Analytics</h1>
        <p className="text-responsive-base">
          Monitor submission volume and client device trends.
        </p>
      </header>

      {errorMessage ? (
        <p className="text-responsive-base">{errorMessage}</p>
      ) : null}

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Totals</h2>
          <dl className="detail-list">
            <div>
              <dt>Total</dt>
              <dd>{totals.total ?? 0}</dd>
            </div>
            <div>
              <dt>Pending</dt>
              <dd>{totals.pending ?? 0}</dd>
            </div>
            <div>
              <dt>Complete</dt>
              <dd>{totals.complete ?? 0}</dd>
            </div>
            <div>
              <dt>Failed</dt>
              <dd>{totals.failed ?? 0}</dd>
            </div>
            <div>
              <dt>Complete rate</dt>
              <dd>{formatPercent(completeRate)}</dd>
            </div>
            <div>
              <dt>Failed rate</dt>
              <dd>{formatPercent(failedRate)}</dd>
            </div>
          </dl>
        </Card>

        <Card className="detail-card">
          <h2 className="detail-title">Token usage</h2>
          <dl className="detail-list">
            <div>
              <dt>Submissions with usage</dt>
              <dd>{usage.submissionsWithUsage ?? 0}</dd>
            </div>
            <div>
              <dt>Total tokens</dt>
              <dd>{usage.totalTokens ?? 0}</dd>
            </div>
            <div>
              <dt>Avg total</dt>
              <dd>{usage.averageTotalTokens ?? 0}</dd>
            </div>
            <div>
              <dt>Total prompt</dt>
              <dd>{usage.promptTokens ?? 0}</dd>
            </div>
            <div>
              <dt>Total completion</dt>
              <dd>{usage.completionTokens ?? 0}</dd>
            </div>
            <div>
              <dt>Avg prompt</dt>
              <dd>{usage.averagePromptTokens ?? 0}</dd>
            </div>
            <div>
              <dt>Avg completion</dt>
              <dd>{usage.averageCompletionTokens ?? 0}</dd>
            </div>
          </dl>
        </Card>

        <Card className="detail-card">
          <h2 className="detail-title">Time to complete</h2>
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
      </div>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Token usage by system version</h2>
          <HorizontalScroll ariaLabel="Token usage by system version table" className="admin-scroll">
            <Table
              columns={[
                { key: 'version', label: 'Version' },
                { key: 'avgTotalTokens', label: 'Avg total tokens' },
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

        <Card className="detail-card">
          <h2 className="detail-title">Token usage by user version</h2>
          <HorizontalScroll ariaLabel="Token usage by user version table" className="admin-scroll">
            <Table
              columns={[
                { key: 'version', label: 'Version' },
                { key: 'avgTotalTokens', label: 'Avg total tokens' },
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
      </div>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Counts by day</h2>
          <HorizontalScroll ariaLabel="Counts by day table" className="admin-scroll">
            <Table
              columns={[
                { key: 'date', label: 'Date' },
                { key: 'total', label: 'Total' },
                { key: 'pending', label: 'Pending' },
                { key: 'complete', label: 'Complete' },
                { key: 'failed', label: 'Failed' },
              ]}
              data={countsByDay}
              loading={loading}
              emptyMessage="No data yet."
              ariaLabel="Counts by day"
            />
          </HorizontalScroll>
        </Card>

        <Card className="detail-card">
          <h2 className="detail-title">Latency by day</h2>
          <HorizontalScroll ariaLabel="Latency by day table" className="admin-scroll">
            <Table
              columns={[
                { key: 'date', label: 'Date' },
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
      </div>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Retry behavior</h2>
          <dl className="detail-list">
            <div>
              <dt>Total retries</dt>
              <dd>{Number(totalRetries).toLocaleString()}</dd>
            </div>
            <div>
              <dt>Retry success rate</dt>
              <dd>{formatPercent(retrySuccessRate)}</dd>
            </div>
          </dl>
        </Card>

        <Card className="detail-card">
          <h2 className="detail-title">Retries by day</h2>
          <HorizontalScroll ariaLabel="Retries by day table" className="admin-scroll">
            <Table
              columns={[
                { key: 'date', label: 'Date' },
                { key: 'retries', label: 'Retries' },
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
      </div>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Top browsers</h2>
          <HorizontalScroll ariaLabel="Top browsers table" className="admin-scroll">
            <Table
              columns={[
                { key: 'key', label: 'Browser' },
                { key: 'count', label: 'Count' },
              ]}
              data={topBrowsers}
              loading={loading}
              emptyMessage="No data yet."
              ariaLabel="Top browsers"
            />
          </HorizontalScroll>
        </Card>
        <Card className="detail-card">
          <h2 className="detail-title">Top devices</h2>
          <HorizontalScroll ariaLabel="Top devices table" className="admin-scroll">
            <Table
              columns={[
                { key: 'key', label: 'Device' },
                { key: 'count', label: 'Count' },
              ]}
              data={topDevices}
              loading={loading}
              emptyMessage="No data yet."
              ariaLabel="Top devices"
            />
          </HorizontalScroll>
        </Card>
      </div>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Top referrers</h2>
          <HorizontalScroll ariaLabel="Top referrers table" className="admin-scroll">
            <Table
              columns={[
                { key: 'key', label: 'Referrer' },
                { key: 'count', label: 'Count' },
              ]}
              data={topReferrers}
              loading={loading}
              emptyMessage="No data yet."
              ariaLabel="Top referrers"
            />
          </HorizontalScroll>
        </Card>
        <Card className="detail-card">
          <h2 className="detail-title">Top countries</h2>
          <HorizontalScroll ariaLabel="Top countries table" className="admin-scroll">
            <Table
              columns={[
                { key: 'key', label: 'Country' },
                { key: 'count', label: 'Count' },
              ]}
              data={topCountries}
              loading={loading}
              emptyMessage="No data yet."
              ariaLabel="Top countries"
            />
          </HorizontalScroll>
        </Card>
      </div>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Failure analytics</h2>
          <dl className="detail-list">
            <div>
              <dt>Failure rate</dt>
              <dd>{formatPercent(failureRate)}</dd>
            </div>
          </dl>
          <HorizontalScroll ariaLabel="Top failures table" className="admin-scroll">
            <Table
              columns={[
                { key: 'message', label: 'Message' },
                { key: 'count', label: 'Count' },
              ]}
              data={topFailures}
              loading={loading}
              emptyMessage="No data yet."
              ariaLabel="Top failures"
            />
          </HorizontalScroll>
        </Card>

        <Card className="detail-card">
          <h2 className="detail-title">Failures by prompt version</h2>
          <HorizontalScroll ariaLabel="Failures by prompt version table" className="admin-scroll">
            <Table
              columns={[
                { key: 'systemPromptVersion', label: 'System' },
                { key: 'userPromptVersion', label: 'User' },
                { key: 'count', label: 'Count' },
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
      </div>

      <div className="detail-grid">
        <Card className="detail-card">
          <h2 className="detail-title">Prompt performance (pair)</h2>
          <HorizontalScroll ariaLabel="Prompt performance by pair table" className="admin-scroll">
            <Table
              columns={[
                { key: 'systemPromptVersion', label: 'System' },
                { key: 'userPromptVersion', label: 'User' },
                { key: 'completeRate', label: 'Complete rate' },
                { key: 'avgDurationMs', label: 'Avg duration' },
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

        <Card className="detail-card">
          <h2 className="detail-title">System prompt performance</h2>
          <HorizontalScroll ariaLabel="System prompt performance table" className="admin-scroll">
            <Table
              columns={[
                { key: 'version', label: 'Version' },
                { key: 'completeRate', label: 'Complete rate' },
                { key: 'avgDurationMs', label: 'Avg duration' },
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

        <Card className="detail-card">
          <h2 className="detail-title">User prompt performance</h2>
          <HorizontalScroll ariaLabel="User prompt performance table" className="admin-scroll">
            <Table
              columns={[
                { key: 'version', label: 'Version' },
                { key: 'completeRate', label: 'Complete rate' },
                { key: 'avgDurationMs', label: 'Avg duration' },
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
      </div>

      <Card className="detail-card">
        <h2 className="detail-title">Submission analytics</h2>
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
              <Button variant="secondary" onClick={loadDetail} type="button">
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
    </section>
  )
}

export default AdminAnalytics
