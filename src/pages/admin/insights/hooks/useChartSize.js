import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook that measures a DOM element's size using ResizeObserver.
 * Falls back to window resize events if ResizeObserver is unavailable.
 * @param {number} [debounceMs=0] - Optional debounce delay in milliseconds
 * @returns {[React.RefObject<HTMLElement>, { width: number, height: number }]} Ref to attach and current size
 */
const useChartSize = (debounceMs = 0) => {
  const chartRef = useRef(null)
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 })
  const timeoutRef = useRef(null)

  useEffect(() => {
    const element = chartRef.current
    if (!element) return

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect()
      setChartSize((prev) => {
        const next = {
          width: Math.max(0, Math.floor(width)),
          height: Math.max(0, Math.floor(height)),
        }
        if (prev.width === next.width && prev.height === next.height) {
          return prev
        }
        return next
      })
    }

    const handleResize = debounceMs > 0
      ? () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(updateSize, debounceMs)
        }
      : updateSize

    // Initial size measurement (no debounce)
    updateSize()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(element)
    return () => {
      observer.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [debounceMs])

  return [chartRef, chartSize]
}

export default useChartSize
