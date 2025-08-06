import api from './client';

export const register = (data) => api.post('/auth/register', data); // adjust path
export const login = (data) => api.post('/auth/login', data);
export const fetchMe = () => api.get('/auth/me');
