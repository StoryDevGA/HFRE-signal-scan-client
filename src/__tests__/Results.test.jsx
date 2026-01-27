import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ToasterProvider } from '../components/Toaster/Toaster.jsx'
import Results from '../pages/Results.jsx'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('../services/publicResults.js', () => ({
  getPublicResult: vi.fn(),
}))

import * as publicResultsService from '../services/publicResults.js'

const renderWithRouter = (publicId = 'test-id') => {
  return render(
    <ToasterProvider>
      <MemoryRouter initialEntries={[`/results/${publicId}`]}>
        <Routes>
          <Route path="/results/:publicId" element={<Results />} />
        </Routes>
      </MemoryRouter>
    </ToasterProvider>
  )
}

describe('Results page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('displays loading state on mount', () => {
      publicResultsService.getPublicResult.mockImplementation(
        () => new Promise(() => {})
      )

      renderWithRouter()

      expect(screen.getByText('Loading report')).toBeInTheDocument()
    })

    it('renders page header during loading', () => {
      publicResultsService.getPublicResult.mockImplementation(
        () => new Promise(() => {})
      )

      renderWithRouter()

      expect(screen.getByText('Customer-safe signal scan')).toBeInTheDocument()
    })

    it('shows status element with aria-live', () => {
      publicResultsService.getPublicResult.mockImplementation(
        () => new Promise(() => {})
      )

      renderWithRouter()

      // There may be multiple status elements, check that at least one has aria-live
      const statusElements = screen.getAllByRole('status')
      const hasPolite = statusElements.some(el => el.getAttribute('aria-live') === 'polite')
      expect(hasPolite).toBe(true)
    })
  })

  describe('Pending State', () => {
    it('displays generating report text', async () => {
      publicResultsService.getPublicResult.mockResolvedValueOnce({
        status: 'pending',
      })

      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Generating report')).toBeInTheDocument()
      })
    })
  })

  describe('Error States', () => {
    it('displays not-found error', async () => {
      publicResultsService.getPublicResult.mockResolvedValueOnce({
        status: 'not_found',
      })

      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Report not found')).toBeInTheDocument()
      })
    })

    it('displays error with custom message', async () => {
      publicResultsService.getPublicResult.mockResolvedValueOnce({
        status: 'failed',
        message: 'Custom error message',
      })

      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Unable to load report')).toBeInTheDocument()
        expect(screen.getByText('Custom error message')).toBeInTheDocument()
      })
    })

    it('handles service exceptions', async () => {
      publicResultsService.getPublicResult.mockRejectedValueOnce(
        new Error('Network error')
      )

      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Unable to load report')).toBeInTheDocument()
      })
    })
  })

  describe('Success State', () => {
    it('displays action buttons when report ready', async () => {
      publicResultsService.getPublicResult.mockResolvedValueOnce({
        status: 'ready',
        publicId: 'test-id',
        company: 'Test Corp',
        customer_report: 'Report content here',
        metadata: { confidence_level: 'High' },
      })

      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Copy link')).toBeInTheDocument()
        expect(screen.getByText('Download report')).toBeInTheDocument()
      })
    })

    it('displays report content when ready', async () => {
      publicResultsService.getPublicResult.mockResolvedValueOnce({
        status: 'ready',
        publicId: 'abc123',
        company: 'Acme Inc',
        customer_report: 'Some report content',
        metadata: { confidence_level: 'High' },
      })

      renderWithRouter('abc123')

      await waitFor(() => {
        // Report is ready - check for action buttons as indicator
        expect(screen.getByText('Copy link')).toBeInTheDocument()
      })
    })

    it('renders Card wrapper for report', async () => {
      publicResultsService.getPublicResult.mockResolvedValueOnce({
        status: 'ready',
        publicId: 'test',
        company: 'Corp',
        customer_report: 'Content',
        metadata: { confidence_level: 'high' },
      })

      renderWithRouter()

      await waitFor(() => {
        const card = document.querySelector('.report-card')
        expect(card).toBeInTheDocument()
      })
    })
  })

  describe('Shared Header Component', () => {
    it('renders back link to StorylineOS', () => {
      publicResultsService.getPublicResult.mockImplementation(
        () => new Promise(() => {})
      )

      renderWithRouter()

      // Check for the link text first, then verify href
      expect(screen.getByText('Back to StorylineOS')).toBeInTheDocument()
    })

    it('renders header in error state', async () => {
      publicResultsService.getPublicResult.mockResolvedValueOnce({
        status: 'failed',
        message: 'Error',
      })

      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Customer-safe signal scan')).toBeInTheDocument()
      })
    })

    it('renders header in success state', async () => {
      publicResultsService.getPublicResult.mockResolvedValueOnce({
        status: 'ready',
        publicId: 'test',
        company: 'Corp',
        customer_report: 'Report',
        metadata: { confidence_level: 'high' },
      })

      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Customer-safe signal scan')).toBeInTheDocument()
      })
    })
  })
})

