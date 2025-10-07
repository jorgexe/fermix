export default function ModelPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-white mb-8">Model Card</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Model Details</h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-white">Model Type</dt>
                  <dd className="text-gray-400">Ensemble (Random Forest + LightGBM)</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Version</dt>
                  <dd className="text-gray-400">1.0.0</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Task</dt>
                  <dd className="text-gray-400">Multi-class Classification</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Classes</dt>
                  <dd className="text-gray-400">CONFIRMED, FALSE POSITIVE, CANDIDATE</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Training Date</dt>
                  <dd className="text-gray-400">2025</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Model Size</dt>
                  <dd className="text-gray-400">RF: 5.5MB, LGBM: 1.8MB</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Training Data</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Models trained on 9,564 observations from the NASA Kepler mission with 103 engineered features.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong className="text-white">Source:</strong> NASA Exoplanet Archive (Kepler KOI Table)</li>
              <li><strong className="text-white">Split:</strong> 80% training, 20% test</li>
              <li><strong className="text-white">Features:</strong> Orbital parameters, stellar properties, transit characteristics</li>
              <li><strong className="text-white">Labels:</strong> koi_disposition (CONFIRMED, FALSE POSITIVE, CANDIDATE)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Performance Metrics</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Random Forest</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-white">93.2%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">0.95</div>
                    <div className="text-sm text-gray-400">ROC-AUC</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">0.92</div>
                    <div className="text-sm text-gray-400">Precision</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">0.91</div>
                    <div className="text-sm text-gray-400">Recall</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">LightGBM</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-white">91.8%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">0.94</div>
                    <div className="text-sm text-gray-400">ROC-AUC</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">0.90</div>
                    <div className="text-sm text-gray-400">Precision</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">0.89</div>
                    <div className="text-sm text-gray-400">Recall</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Hyperparameters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-3">Random Forest</h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• n_estimators: 200</li>
                  <li>• max_depth: 20</li>
                  <li>• min_samples_split: 5</li>
                  <li>• min_samples_leaf: 2</li>
                  <li>• max_features: sqrt</li>
                  <li>• random_state: 42</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-3">LightGBM</h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• num_leaves: 31</li>
                  <li>• learning_rate: 0.05</li>
                  <li>• n_estimators: 200</li>
                  <li>• max_depth: -1</li>
                  <li>• min_child_samples: 20</li>
                  <li>• random_state: 42</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Intended Use</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              This model is designed for:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Rapid classification of Kepler exoplanet candidates</li>
              <li>Research and educational purposes in astronomy and machine learning</li>
              <li>Demonstrating ML applications in astrophysics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Limitations</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Trained exclusively on Kepler mission data; may not generalize to other telescopes</li>
              <li>Performance degrades with incomplete feature sets</li>
              <li>Candidate class has lower precision due to class imbalance</li>
              <li>Not intended for use in official astronomical classifications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Citation</h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
              <code className="text-sm text-gray-400">
                Fermix: Exoplanet Classification with Machine Learning (2025).
                <br />
                Data from NASA Exoplanet Archive, Kepler KOI Table.
                <br />
                https://exoplanetarchive.ipac.caltech.edu/
              </code>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
