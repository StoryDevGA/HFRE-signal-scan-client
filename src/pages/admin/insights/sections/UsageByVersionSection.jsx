import { Bar } from '@nivo/bar'
import PropTypes from 'prop-types'
import { MdBarChart } from 'react-icons/md'
import Pill from '../../../../components/Pill/Pill.jsx'
import Spinner from '../../../../components/Spinner/Spinner.jsx'
import AnalyticsTableCard from '../components/AnalyticsTableCard.jsx'
import { tokenUsageBySystemBarProps } from '../charts/tokenUsageBySystemBarProps.jsx'
import useChartSize from '../hooks/useChartSize.js'

const EMPTY_PLACEHOLDER = 'N/A'

const UsageByVersionSection = ({
  usageBySystemVersion,
  usageByUserVersion,
  loading,
}) => {
  const [systemChartRef, systemChartSize] = useChartSize()
  const [userChartRef, userChartSize] = useChartSize()
  const systemUsage = [...usageBySystemVersion].sort((a, b) => {
    const aVersion = a.version ?? Number.POSITIVE_INFINITY
    const bVersion = b.version ?? Number.POSITIVE_INFINITY
    return aVersion - bVersion
  })

  const systemChartData = systemUsage.map((item) => ({
    version: item.version == null ? '' : String(item.version),
    avgTotalTokens: Number(item.avgTotalTokens ?? 0),
  }))
  const hasSystemChartData = systemChartData.some(
    (item) => item.avgTotalTokens > 0
  )
  const topSystemEntry = systemChartData.reduce((best, current) => {
    if (!best || current.avgTotalTokens > best.avgTotalTokens) {
      return current
    }
    return best
  }, null)
  const topVersionLabel = topSystemEntry
    ? topSystemEntry.version || EMPTY_PLACEHOLDER
    : EMPTY_PLACEHOLDER
  const topVersionValue = topSystemEntry?.avgTotalTokens ?? 0
  const systemChartHeight = Math.max(220, systemChartData.length * 28 + 48)
  const systemChartWidth = systemChartSize.width || 320
  const systemChartHasSize = systemChartSize.width > 0

  const systemData = systemUsage.map((item) => ({
    version: item.version ?? EMPTY_PLACEHOLDER,
    avgTotalTokens: Number(item.avgTotalTokens ?? 0).toLocaleString(),
  }))

  const userUsage = [...usageByUserVersion].sort((a, b) => {
    const aVersion = a.version ?? Number.POSITIVE_INFINITY
    const bVersion = b.version ?? Number.POSITIVE_INFINITY
    return aVersion - bVersion
  })
  const userChartData = userUsage.map((item) => ({
    version: item.version == null ? '' : String(item.version),
    avgTotalTokens: Number(item.avgTotalTokens ?? 0),
  }))
  const hasUserChartData = userChartData.some((item) => item.avgTotalTokens > 0)
  const topUserEntry = userChartData.reduce((best, current) => {
    if (!best || current.avgTotalTokens > best.avgTotalTokens) {
      return current
    }
    return best
  }, null)
  const topUserLabel = topUserEntry
    ? topUserEntry.version || EMPTY_PLACEHOLDER
    : EMPTY_PLACEHOLDER
  const topUserValue = topUserEntry?.avgTotalTokens ?? 0
  const userChartHeight = Math.max(220, userChartData.length * 28 + 48)
  const userChartWidth = userChartSize.width || 320
  const userChartHasSize = userChartSize.width > 0

  const userData = userUsage.map((item) => ({
    version: item.version ?? EMPTY_PLACEHOLDER,
    avgTotalTokens: Number(item.avgTotalTokens ?? 0).toLocaleString(),
  }))

  return (
    <div className="detail-grid">
      <AnalyticsTableCard
        legend="Token usage by system version"
        columns={[
          { key: 'version', label: 'VERSION' },
          { key: 'avgTotalTokens', label: 'AVG TOTAL TOKENS' },
        ]}
        data={systemData}
        loading={loading}
        emptyMessage="No data yet."
        tableAriaLabel="Token usage by system version"
        scrollAriaLabel="Token usage by system version table"
        showTable={false}
        legendIcon={<MdBarChart size={14} />}
        topContent={
          <>
            <div className="status-summary status-summary--usage">
              <div className="status-chart status-chart--usage">
                <div
                  className="analytics-chart analytics-chart--usage-bar"
                  aria-hidden="true"
                  style={{ height: systemChartHeight }}
                >
                  <div className="analytics-chart__inner" ref={systemChartRef}>
                    {loading && !hasSystemChartData ? (
                      <div className="analytics-chart__loading">
                        <Spinner size="sm" />
                      </div>
                    ) : hasSystemChartData ? (
                      systemChartHasSize ? (
                        <Bar
                          data={systemChartData}
                          keys={['avgTotalTokens']}
                          indexBy="version"
                          valueScale={{ type: 'linear' }}
                          indexScale={{ type: 'band', round: true }}
                          width={systemChartWidth}
                          height={systemChartHeight}
                          {...tokenUsageBySystemBarProps}
                        />
                      ) : (
                        <div className="analytics-chart__loading">
                          <Spinner size="sm" />
                        </div>
                      )
                    ) : (
                      <span className="analytics-chart__empty">No token usage data</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {hasSystemChartData ? (
              <div className="status-metrics status-metrics--tokens">
                <div className="status-metric">
                  <Pill variant="info" size="sm">
                    <span className="status-pill__label">Top version</span>
                    <span className="status-pill__value">
                      {topVersionLabel} / {Number(topVersionValue).toLocaleString()}
                    </span>
                  </Pill>
                </div>
              </div>
            ) : null}
          </>
        }
      />
      <AnalyticsTableCard
        legend="Token usage by user version"
        columns={[
          { key: 'version', label: 'VERSION' },
          { key: 'avgTotalTokens', label: 'AVG TOTAL TOKENS' },
        ]}
        data={userData}
        loading={loading}
        emptyMessage="No data yet."
        tableAriaLabel="Token usage by user version"
        scrollAriaLabel="Token usage by user version table"
        showTable={false}
        legendIcon={<MdBarChart size={14} />}
        topContent={
          <>
            <div className="status-summary status-summary--usage">
              <div className="status-chart status-chart--usage">
                <div
                  className="analytics-chart analytics-chart--usage-bar"
                  aria-hidden="true"
                  style={{ height: userChartHeight }}
                >
                  <div className="analytics-chart__inner" ref={userChartRef}>
                    {loading && !hasUserChartData ? (
                      <div className="analytics-chart__loading">
                        <Spinner size="sm" />
                      </div>
                    ) : hasUserChartData ? (
                      userChartHasSize ? (
                        <Bar
                          data={userChartData}
                          keys={['avgTotalTokens']}
                          indexBy="version"
                          valueScale={{ type: 'linear' }}
                          indexScale={{ type: 'band', round: true }}
                          width={userChartWidth}
                          height={userChartHeight}
                          {...tokenUsageBySystemBarProps}
                        />
                      ) : (
                        <div className="analytics-chart__loading">
                          <Spinner size="sm" />
                        </div>
                      )
                    ) : (
                      <span className="analytics-chart__empty">No token usage data</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {hasUserChartData ? (
              <div className="status-metrics status-metrics--tokens">
                <div className="status-metric">
                  <Pill variant="info" size="sm">
                    <span className="status-pill__label">Top version</span>
                    <span className="status-pill__value">
                      {topUserLabel} / {Number(topUserValue).toLocaleString()}
                    </span>
                  </Pill>
                </div>
              </div>
            ) : null}
          </>
        }
      />
    </div>
  )
}

const versionUsageShape = PropTypes.shape({
  version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  avgTotalTokens: PropTypes.number,
})

UsageByVersionSection.propTypes = {
  usageBySystemVersion: PropTypes.arrayOf(versionUsageShape).isRequired,
  usageByUserVersion: PropTypes.arrayOf(versionUsageShape).isRequired,
  loading: PropTypes.bool,
}

export default UsageByVersionSection
