import PropTypes from 'prop-types'
import AnalyticsTableCard from '../components/AnalyticsTableCard.jsx'

const EMPTY_PLACEHOLDER = 'â€”'

const UsageByVersionSection = ({
  usageBySystemVersion,
  usageByUserVersion,
  loading,
}) => {
  const systemData = [...usageBySystemVersion]
    .sort((a, b) => {
      const aVersion = a.version ?? Number.POSITIVE_INFINITY
      const bVersion = b.version ?? Number.POSITIVE_INFINITY
      return aVersion - bVersion
    })
    .map((item) => ({
      version: item.version ?? EMPTY_PLACEHOLDER,
      avgTotalTokens: Number(item.avgTotalTokens ?? 0).toLocaleString(),
    }))

  const userData = [...usageByUserVersion]
    .sort((a, b) => {
      const aVersion = a.version ?? Number.POSITIVE_INFINITY
      const bVersion = b.version ?? Number.POSITIVE_INFINITY
      return aVersion - bVersion
    })
    .map((item) => ({
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
