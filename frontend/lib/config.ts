/**
 * API Configuration
 * Centralized configuration for backend API calls
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  health: '/health',
  dataset: '/dataset',
  stats: '/stats',
  predict: '/predict',
  info: '/info',
  docs: '/docs',
} as const;

export const API_URL = {
  swagger: `${API_CONFIG.baseURL.replace('/api/v1', '')}/api/v1/docs`,
};
