import { api } from '../lib/api.js'

export function getAdminSubmissions({
  q,
  status,
  page = 1,
  pageSize = 10,
} = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (status) params.set('status', status)
  if (page) params.set('page', String(page))
  if (pageSize) params.set('pageSize', String(pageSize))

  const query = params.toString()
  const suffix = query ? `?${query}` : ''
  return api.get(`/api/admin/submissions${suffix}`, { credentials: 'include' })
}
