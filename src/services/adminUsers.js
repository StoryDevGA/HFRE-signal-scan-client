import { api } from '../lib/api.js'

export function deleteAdminUser(email) {
  return api.delete(`/api/admin/users/${encodeURIComponent(email)}`, {
    credentials: 'include',
  })
}
