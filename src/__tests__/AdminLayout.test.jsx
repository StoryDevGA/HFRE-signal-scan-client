import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ToasterProvider } from '../components/Toaster/Toaster.jsx'
import AdminLayout from '../pages/admin/AdminLayout.jsx'

vi.mock('../services/adminAuth.js', () => ({
  checkAdminSession: vi.fn().mockResolvedValue(true),
}))

describe('AdminLayout', () => {
  it('renders admin navigation when session is valid', async () => {
    render(
      <ToasterProvider>
        <MemoryRouter>
          <AdminLayout />
        </MemoryRouter>
      </ToasterProvider>
    )

    expect(await screen.findByText('Submissions')).toBeInTheDocument()
  })
})
