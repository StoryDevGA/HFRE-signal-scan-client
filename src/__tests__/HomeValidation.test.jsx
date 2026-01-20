import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ToasterProvider } from '../components/Toaster/Toaster.jsx'
import Home from '../pages/Home.jsx'
import { vi } from 'vitest'

vi.mock('../services/publicScans.js', () => ({
  submitPublicScan: vi.fn().mockResolvedValue({ publicId: 'test-id' }),
}))

describe('Home form validation', () => {
  it('shows required field errors on submit', async () => {
    const user = userEvent.setup()
    render(
      <ToasterProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ToasterProvider>
    )

    await user.click(screen.getByRole('button', { name: /generate my report/i }))

    expect(await screen.findByText('Contact name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
  })
})
