import { Chip, TableTooltip } from '@nivo/tooltip'
import { formatCompactNumber } from '../selectors/index.js'

const formatVersionLabel = (value) => (value === '' ? 'N/A' : String(value))

export const tokenUsageBySystemBarProps = {
  margin: { top: 8, right: 16, bottom: 32, left: 64 },
  padding: 0.3,
  layout: 'horizontal',
  colors: (bar) => {
    const index = typeof bar.index === 'number' ? bar.index : 0
    return index % 2 === 0 ? 'var(--color-info)' : 'var(--color-warning)'
  },
  enableLabel: false,
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 0,
    tickPadding: 6,
    tickValues: 3,
    format: formatCompactNumber,
  },
  axisLeft: {
    tickSize: 0,
    tickPadding: 8,
    format: formatVersionLabel,
  },
  tooltip: ({ indexValue, value, color }) => (
    <TableTooltip
      title={formatVersionLabel(indexValue)}
      rows={[
        [
          <Chip
            key="token-usage-chip"
            color={color}
            style={{ borderRadius: '999px' }}
          />,
          'Avg total tokens',
          Number(value ?? 0).toLocaleString(),
        ],
      ]}
    />
  ),
  theme: {
    fontFamily: 'var(--font-sans)',
    textColor: 'var(--color-text-secondary)',
    axis: {
      ticks: {
        text: {
          fill: 'var(--color-text-primary)',
          fontWeight: 600,
          fontSize: 12,
        },
      },
    },
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
