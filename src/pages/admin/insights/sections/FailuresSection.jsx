import PropTypes from 'prop-types'
import Card from '../../../../components/Card/Card.jsx'
import Fieldset from '../../../../components/Fieldset/Fieldset.jsx'
import HorizontalScroll from '../../../../components/HorizontalScroll/HorizontalScroll.jsx'
import Table from '../../../../components/Table/Table.jsx'
import AnalyticsTableCard from '../components/AnalyticsTableCard.jsx'

const EMPTY_PLACEHOLDER = '—'

const FailuresSection = ({
  failureRate,
  topFailures,
  failureByPromptVersion,
  renderPercent,
  loading,
}) => (
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

    <AnalyticsTableCard
      legend="Failures by prompt version"
      columns={[
        { key: 'systemPromptVersion', label: 'SYSTEM' },
        { key: 'userPromptVersion', label: 'USER' },
        { key: 'count', label: 'COUNT' },
      ]}
      data={failureByPromptVersion.map((item) => ({
        systemPromptVersion: item.systemPromptVersion ?? EMPTY_PLACEHOLDER,
        userPromptVersion: item.userPromptVersion ?? EMPTY_PLACEHOLDER,
        count: item.count ?? 0,
      }))}
      loading={loading}
      emptyMessage="No data yet."
      tableAriaLabel="Failures by prompt version"
      scrollAriaLabel="Failures by prompt version table"
    />
  </div>
)

FailuresSection.propTypes = {
  failureRate: PropTypes.number.isRequired,
  topFailures: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string,
      count: PropTypes.number,
    })
  ).isRequired,
  failureByPromptVersion: PropTypes.arrayOf(
    PropTypes.shape({
      systemPromptVersion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      userPromptVersion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      count: PropTypes.number,
    })
  ).isRequired,
  renderPercent: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default FailuresSection
