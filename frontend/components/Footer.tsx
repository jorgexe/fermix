export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 text-gray-300 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">FermiX</p>
            <p className="text-sm leading-relaxed text-gray-400">
              Exploring exoplanets with machine learning models trained on NASA Kepler, K2, and TESS missions.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Navigate</p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="/about" className="transition hover:text-white">About</a>
              <a href="/model" className="transition hover:text-white">Model Card</a>
              <a
                href="https://github.com/jorgexe/fermix"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Resources</p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a
                href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '/api/v1/docs') || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                API Documentation
              </a>
              <a
                href="https://exoplanetarchive.ipac.caltech.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                NASA Exoplanet Archive
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-gray-500 sm:flex-row">
          <p>© 2025 FermiX. Built with NASA data.</p>
          <div className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-gray-600">
            <span>Next.js</span>
            <span>FastAPI</span>
            <span>LightGBM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
