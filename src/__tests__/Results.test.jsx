import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ToasterProvider } from '../components/Toaster/Toaster.jsx'
import Results from '../pages/Results.jsx'
import { vi } from 'vitest'

vi.mock('../services/publicResults.js', () => ({
  getPublicResult: vi.fn().mockResolvedValue({
    status: 'complete',
    publicId: 'abc123',
    company: 'Acme Inc',
    customer_report: 'Overview:\nAll good.',
    metadata: { confidence_level: 'High' },
  }),
}))

describe('Results page', () => {
  it('renders the customer report when complete', async () => {
    render(
      <ToasterProvider>
        <MemoryRouter initialEntries={['/results/abc123']}>
          <Routes>
            <Route path="/results/:publicId" element={<Results />} />
          </Routes>
        </MemoryRouter>
      </ToasterProvider>
    )

    expect(await screen.findByText('Acme Inc')).toBeInTheDocument()
    expect(screen.getByText('Overview:')).toBeInTheDocument()
    expect(screen.getByText('All good.')).toBeInTheDocument()
  })
})
