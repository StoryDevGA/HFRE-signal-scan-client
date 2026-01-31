import PropTypes from 'prop-types'
import AnalyticsTableCard from '../components/AnalyticsTableCard.jsx'

const TopClientsSection = ({
  topBrowsers,
  topDevices,
  topReferrers,
  topCountries,
  loading,
}) => (
  <>
    <div className="detail-grid">
      <AnalyticsTableCard
        legend="Top browsers"
        columns={[
          { key: 'key', label: 'BROWSER' },
          { key: 'count', label: 'COUNT' },
        ]}
        data={topBrowsers}
        loading={loading}
        emptyMessage="No data yet."
        tableAriaLabel="Top browsers"
        scrollAriaLabel="Top browsers table"
      />
      <AnalyticsTableCard
        legend="Top devices"
        columns={[
          { key: 'key', label: 'DEVICE' },
          { key: 'count', label: 'COUNT' },
        ]}
        data={topDevices}
        loading={loading}
        emptyMessage="No data yet."
        tableAriaLabel="Top devices"
        scrollAriaLabel="Top devices table"
      />
    </div>

    <div className="detail-grid">
      <AnalyticsTableCard
        legend="Top referrers"
        columns={[
          { key: 'key', label: 'REFERRER' },
          { key: 'count', label: 'COUNT' },
        ]}
        data={topReferrers}
        loading={loading}
        emptyMessage="No data yet."
        tableAriaLabel="Top referrers"
        scrollAriaLabel="Top referrers table"
      />
      <AnalyticsTableCard
        legend="Top countries"
        columns={[
          { key: 'key', label: 'COUNTRY' },
          { key: 'count', label: 'COUNT' },
        ]}
        data={topCountries}
        loading={loading}
        emptyMessage="No data yet."
        tableAriaLabel="Top countries"
        scrollAriaLabel="Top countries table"
      />
    </div>
  </>
)

const keyCountShape = PropTypes.shape({
  key: PropTypes.string,
  count: PropTypes.number,
})

TopClientsSection.propTypes = {
  topBrowsers: PropTypes.arrayOf(keyCountShape).isRequired,
  topDevices: PropTypes.arrayOf(keyCountShape).isRequired,
  topReferrers: PropTypes.arrayOf(keyCountShape).isRequired,
  topCountries: PropTypes.arrayOf(keyCountShape).isRequired,
  loading: PropTypes.bool,
}

export default TopClientsSection
