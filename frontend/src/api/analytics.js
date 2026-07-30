import { apiFetch } from './client.js';

export async function getAnalyticsOverview() {
  return await apiFetch('/api/analytics/overview', { method: 'GET' });
}

export async function getAnalyticsDistribution() {
  return await apiFetch('/api/analytics/distribution', { method: 'GET' });
}
