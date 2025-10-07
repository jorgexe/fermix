'use client';

import { useState, useEffect } from 'react';
import { Video, Play, Sparkles } from 'lucide-react';

export default function VideoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border-2 border-white/20 mb-6 transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-5xl md:text-6xl font-extrabold text-white mb-6 transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Video Showcase
          </h1>
          <p className={`text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Explore the universe of exoplanet discovery through visual storytelling
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 md:p-20 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                In Production
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Coming Soon
              </h2>
              
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                We&apos;re crafting an immersive video experience showcasing our AI models, 
                exoplanet discoveries, and the science behind Fermix.
              </p>

              {/* Placeholder Video Frame */}
              <div className="relative aspect-video bg-black/50 rounded-lg border border-white/10 mb-8 overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                      <Play className="w-8 h-8 text-white/40 ml-1" />
                    </div>
                    <p className="text-white/40 text-sm font-medium">Video Preview</p>
                  </div>
                </div>
                
                {/* Animated scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-32 animate-scan" />
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white font-medium mb-1">Model Demonstrations</p>
                  <p className="text-gray-400">Watch AI classify exoplanets in real-time</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white font-medium mb-1">Data Visualization</p>
                  <p className="text-gray-400">Explore 9,564 Kepler observations</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white font-medium mb-1">Behind the Science</p>
                  <p className="text-gray-400">Deep dive into our methodology</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-gray-400 text-sm">
            Want to be notified when the video launches?{' '}
            <a href="/about" className="text-white hover:text-gray-300 transition-colors underline">
              Learn more about Fermix
            </a>
          </p>
        </div>
      </div>

      {/* Custom animation for scanline */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
