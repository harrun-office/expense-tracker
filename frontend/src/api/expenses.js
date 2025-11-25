import { apiRequest } from './client';

export const fetchExpenses = (token, params) =>
  apiRequest('/expenses', { token, params });

export const createExpense = (token, data) =>
  apiRequest('/expenses', { method: 'POST', token, data });

export const updateExpense = (token, id, data) =>
  apiRequest(`/expenses/${id}`, { method: 'PUT', token, data });

export const deleteExpense = (token, id) =>
  apiRequest(`/expenses/${id}`, { method: 'DELETE', token });

