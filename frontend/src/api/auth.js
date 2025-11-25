import { apiRequest } from './client';

export const loginUser = (credentials) =>
  apiRequest('/auth/login', { method: 'POST', data: credentials });

export const registerUser = (payload) =>
  apiRequest('/auth/register', { method: 'POST', data: payload });

export const getCurrentUser = (token) =>
  apiRequest('/auth/me', { token });

