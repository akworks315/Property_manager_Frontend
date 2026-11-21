// Backend URL: set VITE_API_URL in Vercel, otherwise the deployed backend below is used in production.
const PROD_API = 'https://property-manager-backend-gules.vercel.app/api';
const BASE = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_API : '/api')).replace(/\/$/, '');

export async function api(path, method = 'GET', body) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
