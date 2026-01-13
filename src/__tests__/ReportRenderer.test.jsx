import { render, screen } from '@testing-library/react'
import ReportRenderer from '../components/ReportRenderer.jsx'

describe('ReportRenderer', () => {
  it('renders headings and body sections', () => {
    const report = 'Overview:\nThis is the overview.\n\nNEXT STEPS\nDo the thing.'
    render(<ReportRenderer report={report} />)

    expect(screen.getByText('Overview:')).toBeInTheDocument()
    expect(screen.getByText('This is the overview.')).toBeInTheDocument()
    expect(screen.getByText('NEXT STEPS')).toBeInTheDocument()
    expect(screen.getByText('Do the thing.')).toBeInTheDocument()
  })
})
