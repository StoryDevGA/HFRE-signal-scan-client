import { api } from '../lib/api.js'

export function submitPublicScan(payload) {
  return api.post('/api/public/scans', payload)
}
