import PropTypes from 'prop-types'

/** Latency band visual constants */
const LATENCY_BAND_COLOR = 'var(--color-info)'
const LATENCY_BAND_OPACITY = 0.16

const LatencyBandLayer = ({ series }) => {
  const p50Series = series.find((item) => item.id === 'P50')
  const p90Series = series.find((item) => item.id === 'P90')

  if (!p50Series || !p90Series) return null

  const p90ByX = new Map(
    p90Series.data.map((point) => [String(point.data.x), point])
  )

  const bandPoints = p50Series.data
    .map((point) => {
      const match = p90ByX.get(String(point.data.x))
      if (!match) return null
      if (
        point.position.x == null ||
        point.position.y == null ||
        match.position.x == null ||
        match.position.y == null
      ) {
        return null
      }
      return {
        x: point.position.x,
        y0: point.position.y,
        y1: match.position.y,
      }
    })
    .filter(Boolean)

  if (bandPoints.length < 2) return null

  const path = bandPoints.reduce((acc, point, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${acc} ${command}${point.x} ${point.y1}`
  }, '')
  const reversePath = bandPoints
    .slice()
    .reverse()
    .reduce((acc, point) => `${acc} L${point.x} ${point.y0}`, '')

  return (
    <path
      d={`${path}${reversePath} Z`}
      fill={`color-mix(in srgb, ${LATENCY_BAND_COLOR} ${LATENCY_BAND_OPACITY * 100}%, transparent)`}
      stroke="none"
    />
  )
}

LatencyBandLayer.propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          data: PropTypes.shape({
            x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          }),
          position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
          }),
        })
      ).isRequired,
    })
  ).isRequired,
}

export default LatencyBandLayer
