import PropTypes from 'prop-types'
import { formatDurationMs, formatPercent } from '../selectors/index.js'
import AnalyticsTableCard from '../components/AnalyticsTableCard.jsx'

const EMPTY_PLACEHOLDER = 'â€”'

const PromptPerformanceSection = ({
  performanceByPair,
  performanceBySystem,
  performanceByUser,
  loading,
}) => {
  const pairData = [...performanceByPair]
    .sort((a, b) => {
      const aSystem = a.systemPromptVersion ?? Number.POSITIVE_INFINITY
      const bSystem = b.systemPromptVersion ?? Number.POSITIVE_INFINITY
      const aUser = a.userPromptVersion ?? Number.POSITIVE_INFINITY
      const bUser = b.userPromptVersion ?? Number.POSITIVE_INFINITY
      if (aSystem !== bSystem) return aSystem - bSystem
      return aUser - bUser
    })
    .map((item) => ({
      systemPromptVersion: item.systemPromptVersion ?? EMPTY_PLACEHOLDER,
      userPromptVersion: item.userPromptVersion ?? EMPTY_PLACEHOLDER,
      completeRate: formatPercent(item.completeRate),
      avgDurationMs: formatDurationMs(item.avgDurationMs),
    }))

  const systemData = [...performanceBySystem]
    .sort((a, b) => {
      const aVersion = a.version ?? Number.POSITIVE_INFINITY
      const bVersion = b.version ?? Number.POSITIVE_INFINITY
      return aVersion - bVersion
    })
    .map((item) => ({
      version: item.version ?? EMPTY_PLACEHOLDER,
      completeRate: formatPercent(item.completeRate),
      avgDurationMs: formatDurationMs(item.avgDurationMs),
    }))

  const userData = [...performanceByUser]
    .sort((a, b) => {
      const aVersion = a.version ?? Number.POSITIVE_INFINITY
      const bVersion = b.version ?? Number.POSITIVE_INFINITY
      return aVersion - bVersion
    })
    .map((item) => ({
      version: item.version ?? EMPTY_PLACEHOLDER,
      completeRate: formatPercent(item.completeRate),
      avgDurationMs: formatDurationMs(item.avgDurationMs),
    }))

  return (
    <>
      <div className="detail-grid">
        <AnalyticsTableCard
          legend="Prompt performance (pair)"
          columns={[
            { key: 'systemPromptVersion', label: 'SYSTEM' },
            { key: 'userPromptVersion', label: 'USER' },
            { key: 'completeRate', label: 'COMPLETE RATE' },
            { key: 'avgDurationMs', label: 'AVG DURATION' },
          ]}
          data={pairData}
          loading={loading}
          emptyMessage="No data yet."
          tableAriaLabel="Prompt performance by pair"
          scrollAriaLabel="Prompt performance by pair table"
        />
        <AnalyticsTableCard
          legend="System prompt performance"
          columns={[
            { key: 'version', label: 'VERSION' },
            { key: 'completeRate', label: 'COMPLETE RATE' },
            { key: 'avgDurationMs', label: 'AVG DURATION' },
          ]}
          data={systemData}
          loading={loading}
          emptyMessage="No data yet."
          tableAriaLabel="System prompt performance"
          scrollAriaLabel="System prompt performance table"
        />
      </div>

      <div className="detail-grid">
        <AnalyticsTableCard
          legend="User prompt performance"
          columns={[
            { key: 'version', label: 'VERSION' },
            { key: 'completeRate', label: 'COMPLETE RATE' },
            { key: 'avgDurationMs', label: 'AVG DURATION' },
          ]}
          data={userData}
          loading={loading}
          emptyMessage="No data yet."
          tableAriaLabel="User prompt performance"
          scrollAriaLabel="User prompt performance table"
        />
      </div>
    </>
  )
}

const performancePairShape = PropTypes.shape({
  systemPromptVersion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userPromptVersion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  completeRate: PropTypes.number,
  avgDurationMs: PropTypes.number,
})

const performanceVersionShape = PropTypes.shape({
  version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  completeRate: PropTypes.number,
  avgDurationMs: PropTypes.number,
})

PromptPerformanceSection.propTypes = {
  performanceByPair: PropTypes.arrayOf(performancePairShape).isRequired,
  performanceBySystem: PropTypes.arrayOf(performanceVersionShape).isRequired,
  performanceByUser: PropTypes.arrayOf(performanceVersionShape).isRequired,
  loading: PropTypes.bool,
}

export default PromptPerformanceSection

