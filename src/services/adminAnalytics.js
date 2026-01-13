import { api } from '../lib/api.js'

export function getAdminAnalyticsSummary() {
  return api.get('/api/admin/analytics', { credentials: 'include' })
}

export function getAdminAnalyticsDetail(submissionId) {
  return api.get(`/api/admin/analytics/${submissionId}`, {
    credentials: 'include',
  })
}
