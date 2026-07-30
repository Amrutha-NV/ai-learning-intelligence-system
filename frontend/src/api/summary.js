import { apiFetch } from './client.js';

export async function generateSummary(activityId) {
  return await apiFetch(`/api/summaries/generate/${activityId}`, { method: 'POST' });
}

export async function getSummary(activityId) {
  return await apiFetch(`/api/summaries/${activityId}`, { method: 'GET' });
}
