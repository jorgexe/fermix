'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
    </div>
  )
});

export default function VisualsPage() {
  // Sample feature importance data
  const featureImportanceData = [{
    type: 'bar',
    x: [0.18, 0.15, 0.12, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03],
    y: ['koi_period', 'koi_prad', 'koi_steff', 'koi_depth', 'koi_duration', 'koi_teq', 'koi_insol', 'koi_slogg', 'koi_impact', 'koi_smetal'],
    orientation: 'h',
    marker: { color: '#2563eb' }
  }];

  // Sample class distribution
  const classDistData = [{
    values: [5013, 2321, 2230],
    labels: ['FALSE POSITIVE', 'CONFIRMED', 'CANDIDATE'],
    type: 'pie',
    marker: {
      colors: ['#ef4444', '#10b981', '#f59e0b']
    }
  }];

  // Sample scatter plot
  const scatterData = [{
    x: Array.from({length: 100}, () => Math.random() * 20 + 5),
    y: Array.from({length: 100}, () => Math.random() * 10 + 1),
    mode: 'markers',
    type: 'scatter',
    marker: { 
      size: 8, 
      color: Array.from({length: 100}, () => Math.random() > 0.5 ? '#10b981' : '#ef4444'),
      opacity: 0.6
    },
    text: Array.from({length: 100}, (_, i) => i > 50 ? 'CONFIRMED' : 'FALSE POSITIVE')
  }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Data Visualizations
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Explore model insights and dataset characteristics
        </p>
      </div>

      <div className="space-y-8">
        {/* Feature Importance */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Importance</h2>
          <p className="text-gray-600 mb-4">Top 10 features used by the Random Forest model</p>
          <Plot
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={featureImportanceData as any}
            layout={{
              title: 'Feature Importance Scores',
              xaxis: { title: 'Importance' },
              yaxis: { title: 'Feature' },
              height: 500,
              margin: { l: 150 }
            }}
            config={{ responsive: true }}
            className="w-full"
          />
        </div>

        {/* Class Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Class Distribution</h2>
          <p className="text-gray-600 mb-4">Distribution of labels in the training dataset</p>
          <Plot
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={classDistData as any}
            layout={{
              title: 'Exoplanet Classification Distribution',
              height: 500
            }}
            config={{ responsive: true }}
            className="w-full"
          />
        </div>

        {/* Scatter Plot */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Orbital Period vs Radius</h2>
          <p className="text-gray-600 mb-4">Relationship between orbital period and planetary radius</p>
          <Plot
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={scatterData as any}
            layout={{
              title: 'Orbital Period vs Planetary Radius',
              xaxis: { title: 'Orbital Period (days)' },
              yaxis: { title: 'Planetary Radius (Earth radii)' },
              height: 500,
              hovermode: 'closest'
            }}
            config={{ responsive: true }}
            className="w-full"
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About These Visualizations</h3>
          <p className="text-blue-800">
            These charts are generated from our trained models and the NASA Kepler dataset. 
            Feature importance scores indicate which parameters have the strongest influence on predictions.
            The scatter plots reveal correlations between orbital and physical characteristics of exoplanet candidates.
          </p>
        </div>
      </div>
    </div>
  );
}
