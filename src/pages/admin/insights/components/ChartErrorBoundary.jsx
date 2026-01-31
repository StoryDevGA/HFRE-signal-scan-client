import { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Error boundary component for gracefully handling chart rendering errors.
 * Displays a fallback UI when a chart fails to render.
 */
class ChartErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging (could integrate with error tracking service)
    console.error('Chart rendering error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="analytics-chart__error">
          <span className="analytics-chart__empty">
            {this.props.fallbackMessage || 'Chart failed to load'}
          </span>
        </div>
      )
    }

    return this.props.children
  }
}

ChartErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackMessage: PropTypes.string,
}

export default ChartErrorBoundary
