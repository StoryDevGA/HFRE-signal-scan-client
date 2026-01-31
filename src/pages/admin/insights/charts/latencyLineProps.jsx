/**
 * @fileoverview Latency line chart configuration.
 */

import { Chip, TableTooltip } from '@nivo/tooltip'
import { formatDurationMs } from '../selectors/index.js'
import LatencyBandLayer from './LatencyBandLayer.jsx'

/** Latency chart color constants */
export const LATENCY_CHART_COLORS = {
  p50: 'var(--color-info)',
  p90: 'var(--color-warning)',
}

export const latencyLineProps = {
  margin: { top: 8, right: 8, bottom: 36, left: 8 },
  xScale: { type: 'point' },
  yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: false },
  curve: 'monotoneX',
  lineWidth: 2,
  colors: [LATENCY_CHART_COLORS.p50, LATENCY_CHART_COLORS.p90],
  enablePoints: false,
  enableGridX: false,
  enableGridY: false,
  axisTop: null,
  axisRight: null,
  axisBottom: null,
  axisLeft: null,
  enableSlices: 'x',
  enableCrosshair: true,
  crosshairType: 'x',
  useMesh: false,
  sliceTooltip: ({ slice }) => {
    const title =
      slice.points[0]?.data?.xFormatted ?? slice.points[0]?.data?.x ?? 'Latency'
    return (
      <TableTooltip
        title={title}
        rows={slice.points.map((point) => [
          <Chip
            key={`${point.id}-chip`}
            color={point.seriesColor}
            style={{ borderRadius: '999px' }}
          />,
          point.seriesId,
          point.data.yFormatted,
        ])}
      />
    )
  },
  layers: ['areas', LatencyBandLayer, 'lines', 'slices', 'crosshair', 'legends'],
  yFormat: (value) => formatDurationMs(value),
  legends: [
    {
      anchor: 'bottom',
      direction: 'row',
      translateY: 28,
      itemWidth: 80,
      itemHeight: 18,
      itemsSpacing: 8,
      itemTextColor: 'var(--color-text-primary)',
      symbolSize: 10,
      symbolShape: 'circle',
    },
  ],
  theme: {
    fontFamily: 'var(--font-sans)',
    textColor: 'var(--color-text-secondary)',
    legends: {
      text: {
        fontWeight: 600,
      },
    },
    tooltip: {
      container: {
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
        borderRadius: 0,
        boxShadow: 'var(--shadow-sm)',
        fontSize: '0.85rem',
      },
    },
  },
}
