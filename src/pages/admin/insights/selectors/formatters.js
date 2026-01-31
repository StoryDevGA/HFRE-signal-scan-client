/**
 * @fileoverview Formatting utilities for analytics data display.
 */

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
export const toNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

/**
 * Normalizes a percentage value to a whole number (0-100).
 * Handles both decimal (0.5 → 50) and whole number (50 → 50) inputs.
 * @param {number} value - The value to normalize
 * @returns {number} Percentage as a whole number
 */
export const normalizePercent = (value) => (value > 1 ? value : value * 100)

/**
 * Formats a value as a percentage string.
 * Handles both decimal (0.5) and whole number (50) inputs.
 * @param {unknown} value - The value to format
 * @returns {string} Formatted percentage (e.g., "50%")
 */
export const formatPercent = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0%'
  return `${Math.round(normalizePercent(number))}%`
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
  return normalizePercent(number)
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
