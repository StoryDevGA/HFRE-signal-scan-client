/**
 * @fileoverview Main view model selector for analytics data.
 */

import { toNumber, formatDurationMs } from './formatters.js'
import {
  buildTotalsChartData,
  buildTokenUsageRadialData,
  buildLatencyLineData,
} from './chartSelectors.js'

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
  const latencyByDayRaw = safeSummary.latencyByDay || []
  const latencyByDay = latencyByDayRaw.map((item) => ({
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
  const { latencyLineData, hasLatencyLineChart } = buildLatencyLineData(latencyByDayRaw)

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
    latencyLineData,
    hasLatencyLineChart,
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
