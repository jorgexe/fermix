export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-white mb-8">About Fermix</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
            <p className="text-gray-400 leading-relaxed">
              Fermix is a machine learning-powered exoplanet classification system that leverages NASA Kepler mission data
              to identify confirmed exoplanets, false positives, and candidates. Using state-of-the-art ensemble methods
              (Random Forest and LightGBM), we achieve 91-93% accuracy with 0.95+ ROC-AUC scores.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Backend</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• FastAPI 0.115+</li>
                  <li>• Python 3.13.7</li>
                  <li>• scikit-learn & LightGBM</li>
                  <li>• Docker + Railway</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Frontend</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• Next.js 14+ (App Router)</li>
                  <li>• TypeScript & Tailwind CSS</li>
                  <li>• React Query & Axios</li>
                  <li>• Plotly.js & AG Grid</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Data Sources</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Our models are trained on 9,564 NASA Kepler observations with 103 features including:
            </p>
            <ul className="text-gray-400 space-y-2">
              <li>• <strong className="text-white">Orbital Parameters:</strong> Period, duration, depth, impact parameter</li>
              <li>• <strong className="text-white">Planetary Characteristics:</strong> Radius, temperature, insolation flux</li>
              <li>• <strong className="text-white">Stellar Properties:</strong> Effective temperature, surface gravity, metallicity</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Data sourced from the{' '}
              <a href="https://exoplanetarchive.ipac.caltech.edu/" className="text-white hover:text-gray-300 transition-colors underline" target="_blank" rel="noopener noreferrer">
                NASA Exoplanet Archive
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Model Performance</h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">93%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">0.95</div>
                  <div className="text-sm text-gray-400">ROC-AUC</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">103</div>
                  <div className="text-sm text-gray-400">Features</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">&lt;50ms</div>
                  <div className="text-sm text-gray-400">Latency</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/jorgexe/fermix" className="text-white hover:text-gray-300 transition-colors underline" target="_blank" rel="noopener noreferrer">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="/api/v1/docs" className="text-white hover:text-gray-300 transition-colors underline" target="_blank" rel="noopener noreferrer">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="https://exoplanetarchive.ipac.caltech.edu/" className="text-white hover:text-gray-300 transition-colors underline" target="_blank" rel="noopener noreferrer">
                  NASA Exoplanet Archive
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">License</h2>
            <p className="text-gray-400 leading-relaxed">
              This project is built with publicly available NASA Kepler data. All code and models are provided for
              educational and research purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
