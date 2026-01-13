import { ApiError, api } from '../lib/api.js'
import { getAdminSubmissions } from './adminSubmissions.js'

export function loginAdmin(payload) {
  return api.post('/api/admin/auth/login', payload, { credentials: 'include' })
}

export function logoutAdmin() {
  return api.post('/api/admin/auth/logout', null, { credentials: 'include' })
}

export async function checkAdminSession() {
  try {
    await getAdminSubmissions({ page: 1, pageSize: 1 })
    return true
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return false
    }
    throw error
  }
}
