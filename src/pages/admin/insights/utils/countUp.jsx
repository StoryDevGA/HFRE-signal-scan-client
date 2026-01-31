/**
 * @fileoverview CountUp rendering utilities for animated number displays.
 */

import CountUp from 'react-countup'
import { formatCompactNumber, getPercentValue } from '../selectors/index.js'

/**
 * Creates a set of render functions for animated count displays.
 * @param {boolean} shouldAnimateTotals - Whether to animate from 0
 * @returns {{ renderCount: Function, renderCompactCount: Function, renderPercent: Function }}
 */
export const makeCountUpRenderers = (shouldAnimateTotals) => {
  const getStart = (value) => (shouldAnimateTotals ? 0 : value)
  const toNumber = (value) => Number(value ?? 0)

  const renderCount = (value, options = {}) => {
    const endValue = toNumber(value)
    return (
      <CountUp
        start={getStart(endValue)}
        end={endValue}
        duration={0.9}
        preserveValue={!shouldAnimateTotals}
        separator=","
        {...options}
      />
    )
  }

  const renderCompactCount = (value, options = {}) => {
    const endValue = toNumber(value)
    return (
      <CountUp
        start={getStart(endValue)}
        end={endValue}
        duration={0.9}
        preserveValue={!shouldAnimateTotals}
        formattingFn={formatCompactNumber}
        {...options}
      />
    )
  }

  const renderPercent = (value) => {
    const endValue = getPercentValue(value)
    return (
      <CountUp
        start={getStart(endValue)}
        end={endValue}
        duration={0.9}
        preserveValue={!shouldAnimateTotals}
        decimals={0}
        suffix="%"
      />
    )
  }

  return { renderCount, renderCompactCount, renderPercent }
}
