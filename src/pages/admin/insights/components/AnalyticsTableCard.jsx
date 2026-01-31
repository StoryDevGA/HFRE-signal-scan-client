import PropTypes from 'prop-types'
import Card from '../../../../components/Card/Card.jsx'
import Fieldset from '../../../../components/Fieldset/Fieldset.jsx'
import HorizontalScroll from '../../../../components/HorizontalScroll/HorizontalScroll.jsx'
import Table from '../../../../components/Table/Table.jsx'

const AnalyticsTableCard = ({
  legend,
  legendIcon,
  columns,
  data,
  loading,
  emptyMessage = 'No data yet.',
  tableAriaLabel,
  scrollAriaLabel,
  cardClassName = 'detail-card',
  cardVariant = 'filled',
  cardBackgroundColor = 'transparent',
  cardBordered = false,
  topContent,
  showTable = true,
  scrollClassName = 'admin-scroll',
}) => {
  const resolvedScrollLabel = scrollAriaLabel || tableAriaLabel

  return (
    <Fieldset>
      <Fieldset.Legend icon={legendIcon}>{legend}</Fieldset.Legend>
      <Fieldset.Content>
        <Card
          className={cardClassName}
          variant={cardVariant}
          backgroundColor={cardBackgroundColor}
          bordered={cardBordered}
        >
          {topContent ? topContent : null}
          {showTable ? (
            <HorizontalScroll ariaLabel={resolvedScrollLabel} className={scrollClassName}>
              <Table
                columns={columns}
                data={data}
                loading={loading}
                emptyMessage={emptyMessage}
                ariaLabel={tableAriaLabel}
              />
            </HorizontalScroll>
          ) : null}
        </Card>
      </Fieldset.Content>
    </Fieldset>
  )
}

AnalyticsTableCard.propTypes = {
  legend: PropTypes.string.isRequired,
  legendIcon: PropTypes.node,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  tableAriaLabel: PropTypes.string.isRequired,
  scrollAriaLabel: PropTypes.string,
  cardClassName: PropTypes.string,
  showTable: PropTypes.bool,
  scrollClassName: PropTypes.string,
}

export default AnalyticsTableCard
