import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// ── News ─────────────────────────────────────────────
export const getNews = (params) => api.get('/news', { params });
export const createNews = (data) => api.post('/news', data);
export const deleteNews = (id) => api.delete(`/news/${id}`);

// ── Lost & Found ──────────────────────────────────────
export const getLostFound = (params) => api.get('/lostfound', { params });
export const createLostFound = (data) => api.post('/lostfound', data);
export const updateLFStatus = (id, status) => api.patch(`/lostfound/${id}/status`, { status });
export const deleteLostFound = (id) => api.delete(`/lostfound/${id}`);

// ── Textbooks ─────────────────────────────────────────
export const getTextbooks = (params) => api.get('/textbooks', { params });
export const createTextbook = (data) => api.post('/textbooks', data);
export const markSold = (id) => api.patch(`/textbooks/${id}/sold`);
export const deleteTextbook = (id) => api.delete(`/textbooks/${id}`);

// ── Stats ─────────────────────────────────────────────
export const getStats = () => api.get('/stats');
