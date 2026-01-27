import { api } from '../lib/api.js'

export function getAdminLlmConfig() {
  return api.get('/api/admin/llm-config', { credentials: 'include' })
}

export function updateAdminLlmConfig(payload) {
  return api.put('/api/admin/llm-config', payload, { credentials: 'include' })
}
