/**
 * TypeScript types for Fermix API
 */

// Health Check
export interface HealthResponse {
  status: string;
  version: string;
  models_loaded: boolean;
}

// Dataset
export interface DatasetResponse {
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
  data: ExoplanetRecord[];
}

export interface ExoplanetRecord {
  [key: string]: number | string | null | undefined;
  koi_period?: number;
  koi_duration?: number;
  koi_depth?: number;
  koi_prad?: number;
  koi_steff?: number;
  koi_slogg?: number;
  koi_smetal?: number;
}

// Model Statistics
export interface StatsResponse {
  created_utc: string;
  dataset: string;
  task: string;
  n_samples: {
    train: number | string;
    test: number | string;
  };
  n_features: number;
  models: {
    [key: string]: ModelMetrics;
  };
}

export interface ModelMetrics {
  n_estimators?: number;
  max_depth?: number | null;
  num_leaves?: number;
  learning_rate?: number;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  roc_auc?: number;
}

// Prediction
export interface PredictionInput {
  koi_period?: number;
  koi_duration?: number;
  koi_depth?: number;
  koi_prad?: number;
  koi_teq?: number;
  koi_insol?: number;
  koi_steff?: number;
  koi_slogg?: number;
  koi_smetal?: number;
  koi_model_snr?: number;
  koi_impact?: number;
  koi_count?: number;
  koi_num_transits?: number;
  koi_tce_plnt_num?: number;
  koi_steff_err1?: number;
  koi_steff_err2?: number;
  model_type: 'rf' | 'lgbm';
}

export interface PredictionOutput {
  predicted_class: number;
  predicted_label: string;
  probabilities: {
    [key: string]: number;
  };
  confidence: number;
  top_features: FeatureImportance[];
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

// Form Data
export interface FeatureFormData {
  koi_period: string;
  koi_duration: string;
  koi_depth: string;
  koi_prad: string;
  koi_steff: string;
  koi_slogg: string;
  koi_smetal: string;
  koi_impact: string;
  koi_teq: string;
  koi_insol: string;
  model_type: 'rf' | 'lgbm';
}

// API Error
export interface APIError {
  detail: string;
}
