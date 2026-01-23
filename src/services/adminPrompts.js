import { api } from '../lib/api.js'

export function getAdminPrompts() {
  return api.get('/api/admin/prompts', { credentials: 'include' })
}

export function createAdminPrompt(payload) {
  return api.post('/api/admin/prompts', payload, { credentials: 'include' })
}

export function updateAdminPrompt(id, payload) {
  return api.put(`/api/admin/prompts/${id}`, payload, { credentials: 'include' })
}

export function publishAdminPrompt(id) {
  return api.put(
    `/api/admin/prompts/${id}`,
    { isPublished: true },
    { credentials: 'include' }
  )
}

export function deleteAdminPrompt(id) {
  return api.delete(`/api/admin/prompts/${id}`, { credentials: 'include' })
}
