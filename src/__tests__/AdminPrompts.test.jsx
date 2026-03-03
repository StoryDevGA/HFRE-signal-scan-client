import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { ToasterProvider } from '../components/Toaster/Toaster.jsx'
import { api } from '../lib/api.js'
import AdminPrompts from '../pages/admin/Prompts.jsx'
import {
  createAdminPrompt,
  deleteAdminPrompt,
  getAdminPrompts,
  publishAdminPrompt,
  updateAdminPrompt,
} from '../services/adminPrompts.js'
import { getAdminLlmConfig, updateAdminLlmConfig } from '../services/adminLlmConfig.js'

vi.mock('../lib/api.js', () => {
  class ApiError extends Error {
    constructor(message, status) {
      super(message)
      this.name = 'ApiError'
      this.status = status
    }
  }

  return {
    ApiError,
    api: {
      get: vi.fn(),
    },
  }
})

vi.mock('../services/adminPrompts.js', () => ({
  createAdminPrompt: vi.fn(),
  deleteAdminPrompt: vi.fn(),
  getAdminPrompts: vi.fn(),
  publishAdminPrompt: vi.fn(),
  updateAdminPrompt: vi.fn(),
}))

vi.mock('../services/adminLlmConfig.js', () => ({
  getAdminLlmConfig: vi.fn(),
  updateAdminLlmConfig: vi.fn(),
}))

function makePrompt(overrides = {}) {
  return {
    _id: overrides._id || Math.random().toString(36).slice(2),
    label: overrides.label || 'Prompt',
    type: overrides.type || 'system',
    content: overrides.content || 'Content',
    ownerEmail: overrides.ownerEmail || 'admin@example.com',
    isPublished: overrides.isPublished || false,
    isLocked: overrides.isLocked || false,
    version: overrides.version ?? 0,
    ...overrides,
  }
}

function renderAdminPrompts() {
  return render(
    <ToasterProvider>
      <MemoryRouter>
        <AdminPrompts />
      </MemoryRouter>
    </ToasterProvider>
  )
}

function getTypeTrigger() {
  const trigger = document.getElementById('prompt_type_trigger')
  if (!trigger) {
    throw new Error('Prompt type trigger was not found')
  }
  return trigger
}

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value() {
        this.open = true
      },
    })
  }

  if (!HTMLDialogElement.prototype.close) {
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value() {
        this.open = false
      },
    })
  }
})

beforeEach(() => {
  api.get.mockResolvedValue({ email: 'admin@example.com' })
  getAdminPrompts.mockResolvedValue([])
  getAdminLlmConfig.mockResolvedValue({
    config: {
      mode: 'fixed',
      modelFixed: 'gpt-5.2',
      temperature: null,
      reasoningEffort: 'none',
      updatedBy: 'admin@example.com',
    },
  })
  createAdminPrompt.mockResolvedValue({})
  deleteAdminPrompt.mockResolvedValue({})
  publishAdminPrompt.mockResolvedValue({})
  updateAdminPrompt.mockResolvedValue({})
  updateAdminLlmConfig.mockResolvedValue({})
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('AdminPrompts prompt type selector', () => {
  it('closes the options menu on Escape and outside click', async () => {
    const user = userEvent.setup()
    renderAdminPrompts()

    await waitFor(() => expect(getAdminPrompts).toHaveBeenCalled())

    await user.click(screen.getByRole('button', { name: /new prompt/i }))

    const trigger = getTypeTrigger()
    await user.click(trigger)
    expect(document.querySelectorAll('.prompt-type-select__option')).toHaveLength(2)

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() =>
      expect(document.querySelectorAll('.prompt-type-select__option')).toHaveLength(0)
    )

    await user.click(trigger)
    expect(document.querySelectorAll('.prompt-type-select__option')).toHaveLength(2)

    fireEvent.mouseDown(document.body)
    await waitFor(() =>
      expect(document.querySelectorAll('.prompt-type-select__option')).toHaveLength(0)
    )
  })

  it('updates the selected type and count pill when an option is selected', async () => {
    const user = userEvent.setup()
    getAdminPrompts.mockResolvedValue([
      makePrompt({ _id: 's1', type: 'system' }),
      makePrompt({ _id: 'u1', type: 'user' }),
      makePrompt({ _id: 'u2', type: 'user' }),
    ])
    renderAdminPrompts()

    await waitFor(() => expect(getAdminPrompts).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /new prompt/i }))

    const trigger = getTypeTrigger()
    expect(trigger).toHaveTextContent(/system/i)
    expect(trigger).toHaveTextContent('3 LEFT')

    await user.click(trigger)
    const userOptionLabel = screen.getByText('User')
    const userOptionButton = userOptionLabel.closest('button')
    expect(userOptionButton).not.toBeNull()
    expect(userOptionButton).toHaveTextContent('2 LEFT')

    await user.click(userOptionButton)

    expect(trigger).toHaveTextContent(/user/i)
    expect(trigger).toHaveTextContent('2 LEFT')
    expect(document.querySelectorAll('.prompt-type-select__option')).toHaveLength(0)
  })

  it('disables the selector when only one prompt type is available', async () => {
    const user = userEvent.setup()
    getAdminPrompts.mockResolvedValue([
      makePrompt({ _id: 's1', type: 'system' }),
      makePrompt({ _id: 's2', type: 'system' }),
      makePrompt({ _id: 's3', type: 'system' }),
      makePrompt({ _id: 's4', type: 'system' }),
    ])
    renderAdminPrompts()

    await waitFor(() => expect(getAdminPrompts).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /new prompt/i }))

    const trigger = getTypeTrigger()
    expect(trigger).toBeDisabled()
    expect(trigger).toHaveTextContent(/user/i)
    expect(trigger).toHaveTextContent('4 LEFT')

    await user.click(trigger)
    expect(document.querySelectorAll('.prompt-type-select__option')).toHaveLength(0)
  })

  it('renders per-option count pills in the dropdown menu', async () => {
    const user = userEvent.setup()
    getAdminPrompts.mockResolvedValue([
      makePrompt({ _id: 's1', type: 'system' }),
      makePrompt({ _id: 's2', type: 'system' }),
      makePrompt({ _id: 's3', type: 'system' }),
    ])
    renderAdminPrompts()

    await waitFor(() => expect(getAdminPrompts).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /new prompt/i }))

    const trigger = getTypeTrigger()
    await user.click(trigger)

    const options = Array.from(document.querySelectorAll('.prompt-type-select__option'))
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent(/system/i)
    expect(options[0]).toHaveTextContent('1 LEFT')
    expect(options[1]).toHaveTextContent(/user/i)
    expect(options[1]).toHaveTextContent('4 LEFT')
  })
})
