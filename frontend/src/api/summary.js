import { apiRequest } from './client';

export const fetchSummary = (token, params) =>
  apiRequest('/summary', { token, params });

