import { apiFetch } from './client.js';

export async function getNotificationSettings() {
  return await apiFetch('/api/settings/notifications', { method: 'GET' });
}

export async function updateNotificationSettings(settings) {
  return await apiFetch('/api/settings/notifications', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
}

export async function getPreferences() {
  return await apiFetch('/api/settings/preferences', { method: 'GET' });
}

export async function updatePreferences(preferences) {
  return await apiFetch('/api/settings/preferences', {
    method: 'PATCH',
    body: JSON.stringify(preferences),
  });
}
