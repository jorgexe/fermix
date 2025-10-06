/**
 * Custom React Hooks
 */

import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { apiClient } from './api';
import type {
  HealthResponse,
  DatasetResponse,
  StatsResponse,
  PredictionInput,
  PredictionOutput,
} from './types';

/**
 * Health Check Hook
 */
export function useHealthCheck(): UseQueryResult<HealthResponse> {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
  });
}

/**
 * Dataset Hook
 */
export function useDataset(params: {
  sample?: boolean;
  page?: number;
  page_size?: number;
}): UseQueryResult<DatasetResponse> {
  return useQuery({
    queryKey: ['dataset', params],
    queryFn: () => apiClient.getDataset(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Stats Hook
 */
export function useStats(): UseQueryResult<StatsResponse> {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => apiClient.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Prediction Hook
 */
export function usePrediction(): UseMutationResult<
  PredictionOutput,
  Error,
  PredictionInput
> {
  return useMutation({
    mutationFn: (input: PredictionInput) => apiClient.predict(input),
  });
}
