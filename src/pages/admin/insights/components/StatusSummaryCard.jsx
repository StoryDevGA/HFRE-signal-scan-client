import { Pie } from '@nivo/pie'
import { MdInsights } from 'react-icons/md'
import PropTypes from 'prop-types'
import Card from '../../../../components/Card/Card.jsx'
import Fieldset from '../../../../components/Fieldset/Fieldset.jsx'
import Pill from '../../../../components/Pill/Pill.jsx'
import Spinner from '../../../../components/Spinner/Spinner.jsx'
import { totalsChartProps } from '../charts/totalsChartProps.js'

const StatusSummaryCard = ({
  totalsChartRef,
  totalsChartDimension,
  hasTotalsChart,
  totalsChartData,
  totalsDisplayValue,
  renderCompactCount,
  completeRate,
  failedRate,
  renderPercent,
}) => (
  <Fieldset>
    <Fieldset.Legend icon={<MdInsights size={14} />}>Submission status</Fieldset.Legend>
    <Fieldset.Content>
      <Card className="detail-card">
        <div className="status-summary">
          <div className="status-chart">
            <div className="analytics-chart analytics-chart--totals" aria-hidden="true">
              <div className="analytics-chart__inner" ref={totalsChartRef}>
                {hasTotalsChart ? (
                  totalsChartDimension > 0 ? (
                    <Pie
                      data={totalsChartData}
                      width={totalsChartDimension}
                      height={totalsChartDimension}
                      {...totalsChartProps}
                    />
                  ) : (
                    <div className="analytics-chart__loading">
                      <Spinner size="sm" />
                    </div>
                  )
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
            <Pill variant="info" size="sm">
              <span className="status-pill__label">Success rate</span>
              <span className="status-pill__value">{renderPercent(completeRate)}</span>
            </Pill>
          </div>
          <div className="status-metric">
            <Pill variant="warning" size="sm">
              <span className="status-pill__label">Failed rate</span>
              <span className="status-pill__value">{renderPercent(failedRate)}</span>
            </Pill>
          </div>
        </div>
      </Card>
    </Fieldset.Content>
  </Fieldset>
)

StatusSummaryCard.propTypes = {
  totalsChartRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  totalsChartDimension: PropTypes.number.isRequired,
  hasTotalsChart: PropTypes.bool.isRequired,
  totalsChartData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  totalsDisplayValue: PropTypes.number.isRequired,
  renderCompactCount: PropTypes.func.isRequired,
  completeRate: PropTypes.number.isRequired,
  failedRate: PropTypes.number.isRequired,
  renderPercent: PropTypes.func.isRequired,
}

export default StatusSummaryCard
