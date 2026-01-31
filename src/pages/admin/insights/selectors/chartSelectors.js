/**
 * @fileoverview Chart data builders for analytics visualizations.
 */

import { toNumber } from './formatters.js'

/** Chart color constants */
export const CHART_COLORS = {
  complete: 'var(--color-success)',
  pending: 'var(--color-warning)',
  failed: 'var(--color-error)',
  fallback: 'var(--color-action-primary)',
}

/** Token chart color constants */
export const TOKEN_CHART_COLORS = {
  prompt: 'var(--color-info)',
  completion: 'var(--color-warning)',
}

/**
 * Builds chart data for the totals donut visualization.
 * @param {object} totals - Totals object with complete, pending, failed, total counts
 * @returns {{ totalsChartData: Array, hasTotalsChart: boolean, totalsDisplayValue: number }}
 */
export const buildTotalsChartData = (totals) => {
  const totalsBreakdown = [
    {
      id: 'Complete',
      label: 'Complete',
      value: toNumber(totals.complete),
      color: CHART_COLORS.complete,
      variant: 'success',
    },
    {
      id: 'Pending',
      label: 'Pending',
      value: toNumber(totals.pending),
      color: CHART_COLORS.pending,
      variant: 'warning',
    },
    {
      id: 'Failed',
      label: 'Failed',
      value: toNumber(totals.failed),
      color: CHART_COLORS.failed,
      variant: 'danger',
    },
  ]
  const totalsBreakdownTotal = totalsBreakdown.reduce((sum, item) => sum + item.value, 0)
  const totalsOnlyValue = toNumber(totals.total)
  const hasBreakdown = totalsBreakdownTotal > 0
  const totalsChartData = hasBreakdown
    ? totalsBreakdown.filter((item) => item.value > 0)
    : totalsOnlyValue > 0
      ? [
          {
            id: 'Total',
            label: 'Total',
            value: totalsOnlyValue,
            color: CHART_COLORS.fallback,
            variant: 'info',
          },
        ]
      : []
  const totalsChartDataWithLabels = totalsChartData.map((item) => ({
    ...item,
    label: String(item.label ?? item.id ?? '').toUpperCase(),
  }))
  const totalsDisplayValue = totalsOnlyValue > 0 ? totalsOnlyValue : totalsBreakdownTotal

  return {
    totalsChartData: totalsChartDataWithLabels,
    hasTotalsChart: totalsChartData.length > 0,
    totalsDisplayValue,
  }
}

/**
 * Builds chart data for token usage radial bar visualization.
 * @param {object} values - Token usage values
 * @returns {{
 *  tokenUsageRadialData: Array,
 *  hasTokenUsageRadialChart: boolean,
 *  hasTokenUsageTotalSeries: boolean,
 * }}
 */
export const buildTokenUsageRadialData = ({
  averagePromptTokens,
  averageCompletionTokens,
  promptTokens,
  completionTokens,
}) => {
  const averageSeries = {
    id: 'Avg',
    data: [
      { x: 'PROMPT', y: toNumber(averagePromptTokens) },
      { x: 'COMPLETION', y: toNumber(averageCompletionTokens) },
    ],
  }
  const totalSeries = {
    id: 'Total',
    data: [
      { x: 'PROMPT', y: toNumber(promptTokens) },
      { x: 'COMPLETION', y: toNumber(completionTokens) },
    ],
  }
  const averageTotal = averageSeries.data.reduce((sum, item) => sum + item.y, 0)
  const totalTotal = totalSeries.data.reduce((sum, item) => sum + item.y, 0)
  const tokenUsageRadialData = []

  if (averageTotal > 0) {
    tokenUsageRadialData.push(averageSeries)
  }
  if (totalTotal > 0) {
    tokenUsageRadialData.push(totalSeries)
  }

  return {
    tokenUsageRadialData,
    hasTokenUsageRadialChart: tokenUsageRadialData.length > 0,
    hasTokenUsageTotalSeries: totalTotal > 0,
  }
}

/**
 * Builds chart data for latency line visualization.
 * @param {Array} latencyByDay - Array of latency entries with date, p50, p90
 * @returns {{ latencyLineData: Array, hasLatencyLineChart: boolean }}
 */
export const buildLatencyLineData = (latencyByDay = []) => {
  const series = [
    { id: 'P50', data: [] },
    { id: 'P90', data: [] },
  ]

  latencyByDay.forEach((item) => {
    const date = item.date ?? item._id
    if (!date) return
    series[0].data.push({ x: date, y: toNumber(item.p50) })
    series[1].data.push({ x: date, y: toNumber(item.p90) })
  })

  const hasLatencyLineChart = series.some((item) =>
    item.data.some((point) => point.y > 0)
  )

  return {
    latencyLineData: series.filter((item) => item.data.length > 0),
    hasLatencyLineChart,
  }
}
