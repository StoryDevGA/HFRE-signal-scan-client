import { api } from '../lib/api.js'

export function getAdminSubmissionDetail(id) {
  return api.get(`/api/admin/submissions/${id}`, { credentials: 'include' })
}

export function deleteAdminSubmission(id) {
  return api.delete(`/api/admin/submissions/${id}`, { credentials: 'include' })
}
