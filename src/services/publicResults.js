import { api } from '../lib/api.js'

export function getPublicResult(publicId) {
  return api.get(`/api/public/results/${publicId}`)
}
