export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Project
            </h3>
            <ul className="mt-4 space-y-4">
              <li><a href="/about" className="text-base text-gray-500 hover:text-gray-900">About</a></li>
              <li><a href="/model" className="text-base text-gray-500 hover:text-gray-900">Model Card</a></li>
              <li><a href="https://github.com/jorgexe/fermix" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li><a href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '/api/v1/docs') || '#'} target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">API Documentation</a></li>
              <li><a href="https://exoplanetarchive.ipac.caltech.edu/" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">NASA Exoplanet Archive</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Tech Stack
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Next.js • FastAPI • scikit-learn • LightGBM • Railway • Vercel
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © 2025 Fermix. Built with NASA Kepler data.
          </p>
        </div>
      </div>
    </footer>
  );
}
