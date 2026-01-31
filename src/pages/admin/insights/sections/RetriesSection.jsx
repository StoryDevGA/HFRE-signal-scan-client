import PropTypes from 'prop-types'
import Card from '../../../../components/Card/Card.jsx'
import Fieldset from '../../../../components/Fieldset/Fieldset.jsx'
import AnalyticsTableCard from '../components/AnalyticsTableCard.jsx'

const RetriesSection = ({
  totalRetries,
  retrySuccessRate,
  retriesPerDay,
  renderCount,
  renderPercent,
  loading,
}) => (
  <div className="detail-grid">
    <Fieldset>
      <Fieldset.Legend>Retry behavior</Fieldset.Legend>
      <Fieldset.Content>
        <Card
          className="detail-card"
          variant="filled"
          backgroundColor="transparent"
          bordered={false}
        >
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

    <AnalyticsTableCard
      legend="Retries by day"
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
      tableAriaLabel="Retries by day"
      scrollAriaLabel="Retries by day table"
    />
  </div>
)

RetriesSection.propTypes = {
  totalRetries: PropTypes.number.isRequired,
  retrySuccessRate: PropTypes.number.isRequired,
  retriesPerDay: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      retries: PropTypes.number,
    })
  ).isRequired,
  renderCount: PropTypes.func.isRequired,
  renderPercent: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default RetriesSection
