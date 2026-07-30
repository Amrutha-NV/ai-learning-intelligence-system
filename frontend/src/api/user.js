import { apiFetch } from './client.js';

export async function getCurrentUser() {
  return await apiFetch('/api/users/me', { method: 'GET' });
}

export async function updateProfile(profileData) {
  return await apiFetch('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  });
}

export async function deleteAccount() {
  return await apiFetch('/api/users/me', { method: 'DELETE' });
}
