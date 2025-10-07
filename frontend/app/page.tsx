'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Starfield from '@/components/Starfield';

const START_SPEED = 1.01;
const TARGET_SPEED = 500;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function HomePage() {
  const router = useRouter();
  const [warpSpeed, setWarpSpeed] = useState(START_SPEED);
  const [isWarping, setIsWarping] = useState(false);
  const speedRef = useRef(START_SPEED);

  const warpProgress = clamp((warpSpeed - START_SPEED) / (TARGET_SPEED - START_SPEED), 0, 1);
  const backgroundProgress = clamp((warpProgress - 2 / 3) * 3, 0, 1);
  const contentVisibilityClasses = isWarping
    ? "opacity-0 scale-95 translate-y-8 pointer-events-none"
    : "opacity-100 scale-100 translate-y-0";

  useEffect(() => {
    speedRef.current = warpSpeed;
  }, [warpSpeed]);

  const resetWarp = () => {
    setIsWarping(false);
    setWarpSpeed(START_SPEED);
    speedRef.current = START_SPEED;
  };

  const finishWarp = async () => {
    try {
      await router.push('/demo');
    } catch (error) {
      console.error('Navigation to /demo failed', error);
      resetWarp();
    }
  };

  const handleWarpToDemo = () => {
    if (isWarping) return;
    
    setIsWarping(true);
    
    const duration = 3000;
    const startTime = performance.now();
    const startSpeed = speedRef.current;

    console.log('🚀 Starting warp from', startSpeed, 'to', TARGET_SPEED);
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedSpeed = startSpeed * Math.pow(TARGET_SPEED / startSpeed, progress);

      speedRef.current = easedSpeed;
      setWarpSpeed((prev) => (Math.abs(prev - easedSpeed) > 0.01 ? easedSpeed : prev));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        console.log('✅ Final speed:', easedSpeed.toFixed(2));
        void finishWarp();
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Starfield Background */}
      <Starfield className="z-0" speed={warpSpeed} progress={backgroundProgress} />

      {/* Main Content */}
      <main
        className={`relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 transition-all duration-700 ease-out ${contentVisibilityClasses}`}
      >
        {/* Hero Section */}
        <section className="w-full text-center space-y-8">
          <h1 className="text-7xl md:text-9xl font-light tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            FermiX
          </h1>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed">
              AI and Machine Learning-powered exoplanet detection using NASA&apos;s Kepler, K2, and TESS data.
            </p>
            <p className="text-lg md:text-xl font-extralight text-white/60 leading-relaxed">
              Explore and upload datasets, visualize predictions, and train your own models, or use our team&apos;s pre-trained LightGBM, Random Forest, and CNN models to identify potential exoplanets.
            </p>
          </div>

          <div className="pt-4 space-y-6">
            <button
              onClick={handleWarpToDemo}
              disabled={isWarping}
              className="group inline-flex items-center gap-2 rounded-full border border-white/60 px-12 py-4 text-base tracking-wide font-medium text-white/90 hover:border-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWarping ? 'Engaging Warp Drive...' : 'Try Demo'}
              <span className={`transition-transform ${isWarping ? 'animate-pulse' : 'group-hover:translate-x-1'}`}>→</span>
            </button>
            
            <div className="flex justify-center">
              <a
                href="https://github.com/jorgexe/fermix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors duration-200"
                aria-label="View on GitHub"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Links */}
      <footer
        className={`relative z-10 py-8 text-center transition-all duration-700 ease-out ${contentVisibilityClasses}`}
      >
        <div className="flex items-center justify-center gap-6 mb-4">
          <a
            href="https://github.com/jorgexe/fermix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors duration-200"
            aria-label="GitHub Repository"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="https://www.nasa.gov/kepler"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors duration-200"
            aria-label="NASA Kepler Mission"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 3.18l7 3.5v6.32c0 4.31-2.8 8.36-7 9.84-4.2-1.48-7-5.53-7-9.84V8.68l7-3.5z"/>
            </svg>
          </a>
        </div>
        <p className="text-xs tracking-wide text-white/40 leading-relaxed">
          Built for NASA Space Apps Challenge 2025 – Team FermiX (UABC)
        </p>
      </footer>
    </div>
  );
}
