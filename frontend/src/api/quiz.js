import { apiFetch } from './client.js';

export async function generateQuiz(activityId) {
  return await apiFetch(`/api/quizzes/generate/${activityId}`, { method: 'POST' });
}

export async function getQuiz(activityId) {
  return await apiFetch(`/api/quizzes/${activityId}`, { method: 'GET' });
}

export async function submitQuiz(activityId, submissionData) {
  return await apiFetch(`/api/quizzes/${activityId}/submit`, {
    method: 'POST',
    body: JSON.stringify(submissionData),
  });
}
