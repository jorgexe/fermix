/**
 * API Client
 * Handles all API calls to the backend
 */

import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from './config';
import type {
  HealthResponse,
  DatasetResponse,
  StatsResponse,
  PredictionInput,
  PredictionOutput,
} from './types';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Health Check
   */
  async healthCheck(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>(API_ENDPOINTS.health);
    return response.data;
  }

  /**
   * Get Dataset (paginated)
   */
  async getDataset(params: {
    sample?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<DatasetResponse> {
    const response = await this.client.get<DatasetResponse>(API_ENDPOINTS.dataset, {
      params: {
        sample: params.sample ?? true,
        page: params.page ?? 1,
        page_size: params.page_size ?? 50,
      },
    });
    return response.data;
  }

  /**
   * Get Model Statistics
   */
  async getStats(): Promise<StatsResponse> {
    const response = await this.client.get<StatsResponse>(API_ENDPOINTS.stats);
    return response.data;
  }

  /**
   * Make Prediction
   */
  async predict(input: PredictionInput): Promise<PredictionOutput> {
    const response = await this.client.post<PredictionOutput>(
      API_ENDPOINTS.predict,
      input
    );
    return response.data;
  }

  /**
   * Get API Info
   */
  async getInfo(): Promise<Record<string, unknown>> {
    const response = await this.client.get(API_ENDPOINTS.info);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new APIClient();
