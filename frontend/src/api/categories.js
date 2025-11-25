import { apiRequest } from './client';

export const fetchCategories = (token) =>
  apiRequest('/categories', { token });

export const createCategory = (token, data) =>
  apiRequest('/categories', { method: 'POST', token, data });

export const updateCategory = (token, id, data) =>
  apiRequest(`/categories/${id}`, { method: 'PUT', token, data });

export const deleteCategory = (token, id) =>
  apiRequest(`/categories/${id}`, { method: 'DELETE', token });

