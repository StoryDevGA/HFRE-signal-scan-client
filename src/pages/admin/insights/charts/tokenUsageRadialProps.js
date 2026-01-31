/**
 * @fileoverview Token usage radial bar chart configuration.
 */

import { formatCompactNumber } from '../selectors/index.js'

/** Token chart color constants */
export const TOKEN_CHART_COLORS = {
  prompt: 'var(--color-info)',
  completion: 'var(--color-warning)',
}

/**
 * Gets the color for a radial bar segment based on category and group.
 * @param {object} bar - The bar data object from Nivo
 * @returns {string} CSS color value
 */
const getTokenBarColor = (bar) => {
  const baseColor =
    bar.category === 'PROMPT' ? TOKEN_CHART_COLORS.prompt : TOKEN_CHART_COLORS.completion
  if (bar.groupId === 'Avg') {
    return `color-mix(in srgb, ${baseColor} 45%, var(--color-surface))`
  }
  return baseColor
}

export const tokenUsageRadialProps = {
  margin: { top: 8, right: 8, bottom: 36, left: 8 },
  innerRadius: 0.52,
  padding: 0.36,
  padAngle: 0.02,
  cornerRadius: 4,
  startAngle: -90,
  endAngle: 270,
  colors: getTokenBarColor,
  enableTracks: true,
  tracksColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
  enableRadialGrid: false,
  enableCircularGrid: false,
  radialAxisStart: null,
  radialAxisEnd: null,
  circularAxisInner: null,
  circularAxisOuter: null,
  enableLabels: false,
  valueFormat: formatCompactNumber,
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
