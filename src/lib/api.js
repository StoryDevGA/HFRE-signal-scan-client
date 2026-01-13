const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = ''
    try {
      const data = await response.json()
      message =
        data?.error ||
        data?.message ||
        (Array.isArray(data?.errors) && data.errors[0]?.message) ||
        JSON.stringify(data)
    } catch (error) {
      message = await response.text()
    }
    throw new ApiError(
      message || `Request failed with ${response.status}`,
      response.status
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) =>
    request(path, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (path, body, options) =>
    request(path, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (path, options) => request(path, { method: 'DELETE', ...options }),
}
