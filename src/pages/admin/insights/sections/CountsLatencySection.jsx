import PropTypes from 'prop-types'
import AnalyticsTableCard from '../components/AnalyticsTableCard.jsx'

const CountsLatencySection = ({ countsByDay, latencyByDay, loading }) => (
  <div className="detail-grid">
    <AnalyticsTableCard
      legend="Counts by day"
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
      tableAriaLabel="Counts by day"
      scrollAriaLabel="Counts by day table"
    />
    <AnalyticsTableCard
      legend="Latency by day"
      columns={[
        { key: 'date', label: 'DATE' },
        { key: 'p50', label: 'P50' },
        { key: 'p90', label: 'P90' },
      ]}
      data={latencyByDay}
      loading={loading}
      emptyMessage="No data yet."
      tableAriaLabel="Latency by day"
      scrollAriaLabel="Latency by day table"
    />
  </div>
)

CountsLatencySection.propTypes = {
  countsByDay: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      total: PropTypes.number,
      pending: PropTypes.number,
      complete: PropTypes.number,
      failed: PropTypes.number,
    })
  ).isRequired,
  latencyByDay: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      p50: PropTypes.string,
      p90: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool,
}

export default CountsLatencySection
