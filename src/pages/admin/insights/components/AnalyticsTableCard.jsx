import PropTypes from 'prop-types'
import Card from '../../../../components/Card/Card.jsx'
import Fieldset from '../../../../components/Fieldset/Fieldset.jsx'
import HorizontalScroll from '../../../../components/HorizontalScroll/HorizontalScroll.jsx'
import Table from '../../../../components/Table/Table.jsx'

const AnalyticsTableCard = ({
  legend,
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
  scrollClassName = 'admin-scroll',
}) => {
  const resolvedScrollLabel = scrollAriaLabel || tableAriaLabel

  return (
    <Fieldset>
      <Fieldset.Legend>{legend}</Fieldset.Legend>
      <Fieldset.Content>
        <Card
          className={cardClassName}
          variant={cardVariant}
          backgroundColor={cardBackgroundColor}
          bordered={cardBordered}
        >
          <HorizontalScroll ariaLabel={resolvedScrollLabel} className={scrollClassName}>
            <Table
              columns={columns}
              data={data}
              loading={loading}
              emptyMessage={emptyMessage}
              ariaLabel={tableAriaLabel}
            />
          </HorizontalScroll>
        </Card>
      </Fieldset.Content>
    </Fieldset>
  )
}

AnalyticsTableCard.propTypes = {
  legend: PropTypes.string.isRequired,
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
  scrollClassName: PropTypes.string,
}

export default AnalyticsTableCard
