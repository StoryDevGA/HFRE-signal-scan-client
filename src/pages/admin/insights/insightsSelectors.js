/** Formatter for compact number display (e.g., 1.2K, 3.4M) */
const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
})

/**
 * Safely converts a value to a finite number.
 * @param {unknown} value - The value to convert
 * @returns {number} The numeric value, or 0 if not finite
 */
const toNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

/**
 * Formats a value as a percentage string.
 * Handles both decimal (0.5) and whole number (50) inputs.
 * @param {unknown} value - The value to format
 * @returns {string} Formatted percentage (e.g., "50%")
 */
export const formatPercent = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0%'
  const normalized = number > 1 ? number : number * 100
  return `${Math.round(normalized)}%`
}

/**
 * Extracts a numeric percentage value for animations.
 * Handles both decimal (0.5) and whole number (50) inputs.
 * @param {unknown} value - The value to convert
 * @returns {number} Percentage as a whole number (e.g., 50)
 */
export const getPercentValue = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return number > 1 ? number : number * 100
}

/**
 * Formats a millisecond duration with locale-aware formatting.
 * @param {unknown} value - Duration in milliseconds
 * @returns {string} Formatted duration (e.g., "1,234 ms")
 */
export const formatDurationMs = (value) => {
  const ms = Number(value)
  if (!Number.isFinite(ms)) return '0 ms'
  return `${ms.toLocaleString()} ms`
}

/**
 * Formats a number in compact notation (K, M, B).
 * @param {unknown} value - The number to format
 * @returns {string} Compact formatted number (e.g., "1.2K")
 */
export const formatCompactNumber = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0'
  return compactNumberFormatter.format(number)
}

/**
 * Builds chart data for the totals donut visualization.
 * @param {object} totals - Totals object with complete, pending, failed, total counts
 * @returns {{ totalsChartData: Array, hasTotalsChart: boolean, totalsDisplayValue: number }}
 */
const buildTotalsChartData = (totals) => {
  const totalsBreakdown = [
    {
      id: 'Complete',
      label: 'Complete',
      value: toNumber(totals.complete),
      color: 'var(--color-success)',
      variant: 'success',
    },
    {
      id: 'Pending',
      label: 'Pending',
      value: toNumber(totals.pending),
      color: 'var(--color-warning)',
      variant: 'warning',
    },
    {
      id: 'Failed',
      label: 'Failed',
      value: toNumber(totals.failed),
      color: 'var(--color-error)',
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
            color: 'var(--color-action-primary)',
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
const buildTokenUsageRadialData = ({
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
 * Transforms raw analytics API response into a structured view model.
 * Provides safe defaults for all fields and formats data for display.
 * @param {object|null} summary - Raw analytics summary from API
 * @returns {object} Normalized view model with all analytics data
 */
export const buildAdminAnalyticsViewModel = (summary) => {
  const safeSummary = summary ?? {}
  const totals = safeSummary.totals || {}
  const countsByDay = (safeSummary.countsByDay || []).map((item) => ({
    date: item.date,
    total: item.total ?? item.count ?? 0,
    pending: item.pending ?? 0,
    complete: item.complete ?? 0,
    failed: item.failed ?? 0,
  }))
  const topBrowsers = safeSummary.topBrowsers || []
  const topDevices = safeSummary.topDevices || []
  const topReferrers = safeSummary.topReferrers || []
  const topCountries = safeSummary.topCountries || []
  const usage = safeSummary.usage || {}
  const averagePromptTokens = toNumber(usage.averagePromptTokens)
  const averageCompletionTokens = toNumber(usage.averageCompletionTokens)
  const averageTotalTokens = toNumber(usage.averageTotalTokens)
  const resolvedAverageTotalTokens =
    averageTotalTokens || averagePromptTokens + averageCompletionTokens
  const totalPromptTokens = toNumber(usage.promptTokens)
  const totalCompletionTokens = toNumber(usage.completionTokens)
  const totalTokens = toNumber(usage.totalTokens)
  const resolvedTotalTokens = totalTokens || totalPromptTokens + totalCompletionTokens
  const usageView = {
    ...usage,
    averagePromptTokens,
    averageCompletionTokens,
    averageTotalTokens: resolvedAverageTotalTokens,
    promptTokens: totalPromptTokens,
    completionTokens: totalCompletionTokens,
    totalTokens: resolvedTotalTokens,
  }
  const usageBySystemVersion = usage.bySystemVersion || []
  const usageByUserVersion = usage.byUserVersion || []
  const completeRate = totals.completeRate ?? totals.conversionRate ?? 0
  const failedRate = totals.failedRate ?? 0
  const latency = safeSummary.latencyMs || {}
  const latencyByDay = (safeSummary.latencyByDay || []).map((item) => ({
    date: item.date,
    p50: formatDurationMs(item.p50),
    p90: formatDurationMs(item.p90),
  }))
  const failures = safeSummary.failures || {}
  const topFailures = failures.topFailures || []
  const failureByPromptVersion = failures.failureByPromptVersion || []
  const failureRate = failures.failureRate ?? failedRate
  const promptPerformance = safeSummary.promptPerformance || {}
  const performanceByPair = promptPerformance.byPair || []
  const performanceBySystem = promptPerformance.bySystemVersion || []
  const performanceByUser = promptPerformance.byUserVersion || []
  const retries = safeSummary.retries || {}
  const totalRetries = retries.totalRetries ?? 0
  const retrySuccessRate = retries.retrySuccessRate ?? 0
  const retriesPerDay = (retries.retriesPerDay || []).map((item) => ({
    date: item.date ?? item._id,
    retries: item.retries ?? 0,
  }))
  const {
    totalsChartData,
    hasTotalsChart,
    totalsDisplayValue,
  } = buildTotalsChartData(totals)
  const {
    tokenUsageRadialData,
    hasTokenUsageRadialChart,
    hasTokenUsageTotalSeries,
  } = buildTokenUsageRadialData({
    averagePromptTokens,
    averageCompletionTokens,
    promptTokens: totalPromptTokens,
    completionTokens: totalCompletionTokens,
  })

  return {
    totals,
    countsByDay,
    topBrowsers,
    topDevices,
    topReferrers,
    topCountries,
    usage: usageView,
    usageBySystemVersion,
    usageByUserVersion,
    completeRate,
    failedRate,
    latency,
    latencyByDay,
    topFailures,
    failureByPromptVersion,
    failureRate,
    performanceByPair,
    performanceBySystem,
    performanceByUser,
    totalRetries,
    retrySuccessRate,
    retriesPerDay,
    totalsChartData,
    hasTotalsChart,
    totalsDisplayValue,
    tokenUsageRadialData,
    hasTokenUsageRadialChart,
    hasTokenUsageTotalSeries,
  }
}
