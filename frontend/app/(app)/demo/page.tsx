'use client';

import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { usePrediction } from '@/lib/hooks';
import type { PredictionInput } from '@/lib/types';

export default function DemoPage() {
  const [modelType, setModelType] = useState<'rf' | 'lgbm'>('rf');
  const [formData, setFormData] = useState<PredictionInput>({
    model_type: 'rf',
    koi_period: 10.5,
    koi_impact: 0.5,
    koi_duration: 3.5,
    koi_depth: 500,
    koi_prad: 2.0,
    koi_teq: 400,
    koi_insol: 100,
    koi_steff: 5800,
    koi_slogg: 4.5,
    koi_smetal: 0.1
  });

  const { mutate: predict, isPending, data: result, error } = usePrediction();

  const handleInputChange = (field: keyof PredictionInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'model_type' ? value : parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predict({ ...formData, model_type: modelType });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Prediction Demo
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Enter exoplanet parameters to classify candidates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ML Model
                </label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value as 'rf' | 'lgbm')}
                  className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white focus:ring-2 focus:ring-white/40 focus:border-white/40"
                >
                  <option value="rf">Random Forest</option>
                  <option value="lgbm">LightGBM</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Orbital Period (days)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.koi_period}
                    onChange={(e) => handleInputChange('koi_period', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stellar Log g (log10[cm/s²])
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.koi_slogg}
                    onChange={(e) => handleInputChange('koi_slogg', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Impact Parameter
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.koi_impact}
                    onChange={(e) => handleInputChange('koi_impact', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Transit Duration (hours)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.koi_duration}
                    onChange={(e) => handleInputChange('koi_duration', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Transit Depth (ppm)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.koi_depth}
                    onChange={(e) => handleInputChange('koi_depth', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Planetary Radius (R⊕)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.koi_prad}
                    onChange={(e) => handleInputChange('koi_prad', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Equilibrium Temp (K)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.koi_teq}
                    onChange={(e) => handleInputChange('koi_teq', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Insolation Flux (F⊕)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.koi_insol}
                    onChange={(e) => handleInputChange('koi_insol', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stellar Eff Temp (K)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.koi_steff}
                    onChange={(e) => handleInputChange('koi_steff', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stellar Metallicity [Fe/H]
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.koi_smetal}
                    onChange={(e) => handleInputChange('koi_smetal', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center px-6 py-3 border border-white/60 text-base font-medium rounded-md text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Play className="-ml-1 mr-3 h-5 w-5" />
                    Predict
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
            
            {!result && !error && (
              <div className="text-center py-12">
                <Play className="mx-auto h-12 w-12 text-gray-500" />
                <p className="mt-4 text-gray-400">
                  Enter parameters and click Predict to see results
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4">
                <p className="text-red-400">
                  Error: {error.message}
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${
                    result.predicted_label === 'CONFIRMED' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  }`}>
                    {result.predicted_label}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300">Confidence</span>
                      <span className="text-sm font-bold text-white">
                        {(result.confidence * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          result.confidence > 0.8 ? 'bg-green-500' :
                          result.confidence > 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Class Probabilities
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(result.probabilities).map(([label, prob]) => (
                        <div key={label}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-300">{label}</span>
                            <span className="text-sm font-medium text-white">
                              {(prob * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-white h-2 rounded-full"
                              style={{ width: `${prob * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 text-sm text-gray-400">
                    <p><strong className="text-white">Predicted Class:</strong> {result.predicted_class}</p>
                    <p><strong className="text-white">Model:</strong> {modelType === 'rf' ? 'Random Forest' : 'LightGBM'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
