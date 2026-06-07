/**
 * ════════════════════════════════════════════════════════════════════
 * API Client — Axios with JWT auth interceptor
 * ════════════════════════════════════════════════════════════════════
 */
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('tdc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('tdc_token');
      Cookies.remove('tdc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  Cookies.set('tdc_token', data.token, { expires: 1 });
  Cookies.set('tdc_user', JSON.stringify(data.user), { expires: 1 });
  return data;
}

export function logout() {
  Cookies.remove('tdc_token');
  Cookies.remove('tdc_user');
}

export function getUser() {
  const u = Cookies.get('tdc_user');
  try { return u ? JSON.parse(u) : null; } catch { return null; }
}

export function isLoggedIn() {
  return !!Cookies.get('tdc_token');
}

// ─── Profiles ───
export async function fetchProfiles(params = {}) {
  const { data } = await api.get('/profiles', { params });
  return data;
}

export async function fetchProfile(id) {
  const { data } = await api.get(`/profiles/${id}`);
  return data;
}

export async function fetchStats() {
  const { data } = await api.get('/profiles/stats');
  return data;
}

export async function updateProfile(id, updates) {
  const { data } = await api.patch(`/profiles/${id}`, updates);
  return data;
}

// ─── Matches ───
export async function fetchMatches(profileId) {
  const { data } = await api.get(`/matches/${profileId}`);
  return data;
}

export async function sendMatch(customerId, matchId) {
  const { data } = await api.post('/matches/send', { customerId, matchId });
  return data;
}

// ─── AI (Gemini) ───
export async function getAIMatchScore(profileId, matchId) {
  const { data } = await api.post('/ai/match-score', { profileId, matchId });
  return data;
}

export async function generateIntro(profileId, matchId) {
  const { data } = await api.post('/ai/generate-intro', { profileId, matchId });
  return data;
}

export async function getProfileFit(profileId, matchId) {
  const { data } = await api.post('/ai/profile-fit', { profileId, matchId });
  return data;
}

export default api;
