import { ApiError } from '../lib/api.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function getPublicResult(publicId) {
  const response = await fetch(`${API_BASE_URL}/api/public/results/${publicId}`, {
    headers: { 'Content-Type': 'application/json' },
  })

  let data = null
  try {
    data = await response.json()
  } catch (error) {
    data = null
  }

  if (response.status === 202) {
    return { status: 'pending' }
  }
  if (response.status === 404) {
    return { status: 'not_found' }
  }
  if (response.status === 500) {
    return { status: 'failed', message: data?.message || '' }
  }
  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      (Array.isArray(data?.errors) && data.errors[0]?.message) ||
      'Unable to load report.'
    throw new ApiError(message, response.status)
  }

  return data
}
