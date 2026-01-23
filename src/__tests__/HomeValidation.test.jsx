import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ToasterProvider } from '../components/Toaster/Toaster.jsx'
import Home from '../pages/Home.jsx'
import { vi } from 'vitest'
import { submitPublicScan } from '../services/publicScans.js'

vi.mock('../services/publicScans.js', () => ({
  submitPublicScan: vi.fn().mockResolvedValue({ publicId: 'test-id' }),
}))

describe('Home form validation', () => {
  it('enables submit only when required fields are complete', async () => {
    const user = userEvent.setup()
    render(
      <ToasterProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ToasterProvider>
    )

    const submitButton = screen.getByRole('button', { name: /generate my report/i })
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText(/contact name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com')
    await user.type(screen.getByLabelText(/company name/i), 'Analytical Engines')
    await user.type(screen.getByLabelText(/website/i), 'https://example.com')
    await user.type(screen.getByLabelText(/product or solution page/i), 'https://example.com/product')

    expect(submitButton).toBeEnabled()
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitPublicScan).toHaveBeenCalled()
    })
  })
})
