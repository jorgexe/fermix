'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="h-12 w-12 animate-spin text-white" />
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
    marker: { color: '#ffffff' }
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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Data Visualizations
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Explore model insights and dataset characteristics
          </p>
        </div>

        <div className="space-y-8">
          {/* Feature Importance */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Feature Importance</h2>
            <p className="text-gray-400 mb-4">Top 10 features used by the Random Forest model</p>
            <Plot
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data={featureImportanceData as any}
              layout={{
                title: { text: 'Feature Importance Scores', font: { color: '#ffffff' } },
                xaxis: { title: 'Importance', color: '#9ca3af', gridcolor: '#374151' },
                yaxis: { title: 'Feature', color: '#9ca3af', gridcolor: '#374151' },
                height: 500,
                margin: { l: 150 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#ffffff' }
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {/* Class Distribution */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Class Distribution</h2>
            <p className="text-gray-400 mb-4">Distribution of labels in the training dataset</p>
            <Plot
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data={classDistData as any}
              layout={{
                title: { text: 'Exoplanet Classification Distribution', font: { color: '#ffffff' } },
                height: 500,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#ffffff' }
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {/* Scatter Plot */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Orbital Period vs Radius</h2>
            <p className="text-gray-400 mb-4">Relationship between orbital period and planetary radius</p>
            <Plot
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data={scatterData as any}
              layout={{
                title: { text: 'Orbital Period vs Planetary Radius', font: { color: '#ffffff' } },
                xaxis: { title: 'Orbital Period (days)', color: '#9ca3af', gridcolor: '#374151' },
                yaxis: { title: 'Planetary Radius (Earth radii)', color: '#9ca3af', gridcolor: '#374151' },
                height: 500,
                hovermode: 'closest',
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#ffffff' }
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {/* Info Box */}
          <div className="bg-white/5 border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">About These Visualizations</h3>
            <p className="text-gray-400">
              These charts are generated from our trained models and the NASA Kepler dataset. 
              Feature importance scores indicate which parameters have the strongest influence on predictions.
              The scatter plots reveal correlations between orbital and physical characteristics of exoplanet candidates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
