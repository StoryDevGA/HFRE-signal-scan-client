import { RadialBar } from '@nivo/radial-bar'
import { MdToken } from 'react-icons/md'
import PropTypes from 'prop-types'
import Card from '../../../../components/Card/Card.jsx'
import Fieldset from '../../../../components/Fieldset/Fieldset.jsx'
import Pill from '../../../../components/Pill/Pill.jsx'
import Spinner from '../../../../components/Spinner/Spinner.jsx'
import { tokenUsageRadialProps } from '../charts/tokenUsageRadialProps.js'

const TokenUsageCard = ({
  tokenChartRef,
  tokenChartWidth,
  tokenChartHeight,
  tokenChartHasSize,
  hasTokenUsageChart,
  tokenUsageRadialData,
  tokenCenterValue,
  tokenCenterLabel,
  tokenUsagePills,
  renderCompactCount,
}) => (
  <Fieldset>
    <Fieldset.Legend icon={<MdToken size={14} />}>Token usage</Fieldset.Legend>
    <Fieldset.Content>
      <Card
        className="detail-card"
        variant="filled"
        backgroundColor="transparent"
        bordered={false}
      >
        <div className="status-summary">
          <div className="status-chart status-chart--token">
            <div className="analytics-chart analytics-chart--token-radial" aria-hidden="true">
              <div className="analytics-chart__inner" ref={tokenChartRef}>
                {hasTokenUsageChart ? (
                  tokenChartHasSize ? (
                    <RadialBar
                      {...tokenUsageRadialProps}
                      data={tokenUsageRadialData}
                      width={tokenChartWidth}
                      height={tokenChartHeight}
                    />
                  ) : (
                    <div className="analytics-chart__loading">
                      <Spinner size="sm" />
                    </div>
                  )
                ) : (
                  <span className="analytics-chart__empty">No token usage yet</span>
                )}
              </div>
            </div>
            {hasTokenUsageChart && tokenChartHasSize ? (
              <div className="status-chart__center">
                <span className="status-chart__total">
                  {renderCompactCount(tokenCenterValue)}
                </span>
                <span className="status-chart__label">{tokenCenterLabel}</span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="status-metrics status-metrics--tokens">
          {tokenUsagePills.map((pill) => (
            <div className="status-metric" key={pill.label}>
              <Pill variant={pill.variant} size="sm">
                <span className="status-pill__label">{pill.label}</span>
                <span className="status-pill__value">
                  {renderCompactCount(pill.value)}
                </span>
              </Pill>
            </div>
          ))}
        </div>
      </Card>
    </Fieldset.Content>
  </Fieldset>
)

TokenUsageCard.propTypes = {
  tokenChartRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  tokenChartWidth: PropTypes.number.isRequired,
  tokenChartHeight: PropTypes.number.isRequired,
  tokenChartHasSize: PropTypes.bool.isRequired,
  hasTokenUsageChart: PropTypes.bool.isRequired,
  tokenUsageRadialData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.string.isRequired,
          y: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  tokenCenterValue: PropTypes.number.isRequired,
  tokenCenterLabel: PropTypes.string.isRequired,
  tokenUsagePills: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number,
      variant: PropTypes.string.isRequired,
    })
  ).isRequired,
  renderCompactCount: PropTypes.func.isRequired,
}

export default TokenUsageCard
