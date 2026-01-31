import { Line } from '@nivo/line'
import { MdTimelapse } from 'react-icons/md'
import PropTypes from 'prop-types'
import Card from '../../../../components/Card/Card.jsx'
import Fieldset from '../../../../components/Fieldset/Fieldset.jsx'
import Pill from '../../../../components/Pill/Pill.jsx'
import Spinner from '../../../../components/Spinner/Spinner.jsx'
import { latencyLineProps } from '../charts/latencyLineProps.jsx'

const LatencyCard = ({
  latencyChartRef,
  showLatencySpinner,
  hasLatencyLineChart,
  latencyLineData,
  latencyChartWidth,
  latencyChartHeight,
  renderCount,
  latency,
  latencyPills,
}) => (
  <Fieldset>
    <Fieldset.Legend icon={<MdTimelapse size={14} />}>Time to complete</Fieldset.Legend>
    <Fieldset.Content>
      <Card
        className="detail-card"
        variant="filled"
        backgroundColor="transparent"
        bordered={false}
      >
        <div className="status-summary">
          <div className="status-chart status-chart--latency">
            <div className="analytics-chart analytics-chart--latency" aria-hidden="true">
              <div className="analytics-chart__inner" ref={latencyChartRef}>
                {showLatencySpinner ? (
                  <div className="analytics-chart__loading">
                    <Spinner size="sm" />
                  </div>
                ) : hasLatencyLineChart ? (
                  <Line
                    {...latencyLineProps}
                    data={latencyLineData}
                    width={latencyChartWidth}
                    height={latencyChartHeight}
                  />
                ) : (
                  <span className="analytics-chart__empty">No latency yet</span>
                )}
              </div>
            </div>
            {hasLatencyLineChart ? (
              <div className="status-chart__center">
                <span className="status-chart__total">
                  {renderCount(latency.p50, { suffix: ' ms' })}
                </span>
                <span className="status-chart__label">P50</span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="status-metrics status-metrics--latency">
          {latencyPills.map((pill) => (
            <div className="status-metric" key={pill.label}>
              <Pill variant={pill.variant} size="sm">
                <span className="status-pill__label">{pill.label}</span>
                <span className="status-pill__value">
                  {renderCount(pill.value, { suffix: ' ms' })}
                </span>
              </Pill>
            </div>
          ))}
        </div>
      </Card>
    </Fieldset.Content>
  </Fieldset>
)

LatencyCard.propTypes = {
  latencyChartRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  showLatencySpinner: PropTypes.bool.isRequired,
  hasLatencyLineChart: PropTypes.bool.isRequired,
  latencyLineData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          y: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  latencyChartWidth: PropTypes.number.isRequired,
  latencyChartHeight: PropTypes.number.isRequired,
  renderCount: PropTypes.func.isRequired,
  latency: PropTypes.shape({
    p50: PropTypes.number,
    p90: PropTypes.number,
    p95: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  latencyPills: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number,
      variant: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default LatencyCard
