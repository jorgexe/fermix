'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Database, BarChart3, Brain } from 'lucide-react';
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
    
    const duration = 3000; // 3 seconds
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
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Starfield Background */}
      <Starfield className="z-0" speed={warpSpeed} progress={backgroundProgress} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className={`relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32 transition-all duration-700 ease-out ${contentVisibilityClasses}`}>
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">Exoplanet Classification</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-600">Powered by Machine Learning</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-white/70 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Classify NASA Kepler exoplanet candidates using state-of-the-art Random Forest and LightGBM models.
                  Achieve 91-93% accuracy with our production-ready API.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <button
                      onClick={handleWarpToDemo}
                      disabled={isWarping}
                      className="group w-full flex items-center justify-center px-8 py-3 border border-white/60 text-base font-medium rounded-md text-white/90 hover:border-white hover:bg-white hover:text-black transition-all duration-300 md:py-4 md:text-lg md:px-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isWarping ? 'Engaging Warp Drive...' : 'Try Demo'}
                      <span className={`ml-2 transition-transform ${isWarping ? 'animate-pulse' : 'group-hover:translate-x-1'}`}>→</span>
                    </button>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      href="/dataset"
                      className="w-full flex items-center justify-center px-8 py-3 border border-white/60 text-base font-medium rounded-md text-white/90 hover:border-white hover:bg-white hover:text-black transition-all duration-300 md:py-4 md:text-lg md:px-10"
                    >
                      Explore Data
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`relative z-10 bg-blue-600/10 backdrop-blur-sm border-y border-white/10 transition-all duration-700 ease-out ${contentVisibilityClasses}`}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Production-Ready ML Models
            </h2>
            <p className="mt-3 text-xl text-white/60 sm:mt-4">
              Trained on 9,564 NASA Kepler observations
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-white/60">
                Accuracy
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">93%</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-white/60">
                Features
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">103</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-white/60">
                Models
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">2</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Features Section */}
      <div className={`relative z-10 py-12 transition-all duration-700 ease-out ${contentVisibilityClasses}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Everything you need for exoplanet analysis
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-400">
                    <Brain className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">ML Models</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white/60">
                  Random Forest and LightGBM models with 91-93% accuracy and 0.95+ ROC-AUC scores.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-400">
                    <Database className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">NASA Data</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white/60">
                  9,564 Kepler observations with 103 orbital and stellar parameters.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-400">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">Interactive Visualizations</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white/60">
                  Explore feature importance, correlations, and model performance with interactive charts.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-400">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">REST API</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white/60">
                  FastAPI backend with interactive Swagger documentation and &lt; 50ms prediction latency.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`relative z-10 bg-blue-600/10 backdrop-blur-sm border-t border-white/10 transition-all duration-700 ease-out ${contentVisibilityClasses}`}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-400">Try the demo now.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={handleWarpToDemo}
                disabled={isWarping}
                className="inline-flex items-center justify-center px-5 py-3 border border-white/60 text-base font-medium rounded-md text-white bg-blue-600/20 hover:bg-blue-600/40 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWarping ? 'Warping...' : 'Launch Demo'}
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-5 py-3 border border-white/60 text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
