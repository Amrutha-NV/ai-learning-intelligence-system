import { apiFetch } from './client.js';

export async function signup(fullName, email, password) {
  const data = await apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function login(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function logout() {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Backend logout error:', error);
  } finally {
    localStorage.removeItem('token');
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}

export async function forgotPassword(email) {
  return await apiFetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, newPassword) {
  return await apiFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function loginGoogle(idToken) {
  const data = await apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function loginGithub(accessToken) {
  const data = await apiFetch('/api/auth/github', {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
  });
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}
