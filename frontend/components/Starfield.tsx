"use client";
import React, { useEffect, useRef } from 'react';

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

// 3D forward motion star definition
interface WarpStar { x: number; y: number; z: number; pz: number; twinkleOffset: number; }

interface StarfieldProps { density?: number; className?: string; speed?: number; progress?: number; }

export const Starfield: React.FC<StarfieldProps> = ({ density = 2, className, speed = 1, progress = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const starsRef = useRef<WarpStar[]>([]);
  const speedRef = useRef(speed); // Track speed changes
  const progressRef = useRef(progress);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Update speed ref when prop changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const centerX = () => width / 2;
    const centerY = () => height / 2;

    const createStars = () => {
      const area = width * height;
      const total = Math.min(4500, Math.floor(area / 10000 * density * 3)); // denser for warp
      starsRef.current = [];
      for (let i=0;i<total;i++) {
        starsRef.current.push({
          x: (Math.random()*2 -1) * width,
          y: (Math.random()*2 -1) * height,
          z: Math.random()*width,
          pz: 0,
          twinkleOffset: Math.random()*Math.PI*2,
        });
      }
    };
    createStars();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
      if (reduceMotion) paintStatic(progressRef.current);
    };
    window.addEventListener('resize', onResize);

    const drawNebula = () => {
      const g = ctx.createRadialGradient(centerX()*0.4, centerY()*0.6, 0, centerX()*0.4, centerY()*0.6, width*0.9);
      g.addColorStop(0,'rgba(255,255,255,0.06)');
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g; ctx.fillRect(0,0,width,height);
      ctx.globalCompositeOperation = 'source-over';
    };

    const warpStep = (dt:number, t:number) => {
      const normalized = progressRef.current;
      const backgroundShade = Math.round(lerp(0, 255, normalized));

      ctx.fillStyle = `rgb(${backgroundShade}, ${backgroundShade}, ${backgroundShade})`;
      ctx.fillRect(0,0,width,height);
      drawNebula();
      const cx = centerX(); const cy = centerY();
      const currentSpeed = speedRef.current; // Use ref for latest speed
      for (const s of starsRef.current) {
        s.z -= currentSpeed * dt * 60; // normalized speed
        if (s.z <= 1) { // reset star (simulate continuous stream)
          s.x = (Math.random()*2 -1) * width;
          s.y = (Math.random()*2 -1) * height;
          s.z = width;
          s.pz = s.z;
          s.twinkleOffset = Math.random()*Math.PI*2;
        }
        const k = 200; // perspective scale factor
        const sx = (s.x / s.z) * k + cx;
        const sy = (s.y / s.z) * k + cy;
        const px = (s.x / (s.pz || s.z)) * k + cx;
        const py = (s.y / (s.pz || s.z)) * k + cy;
        s.pz = s.z;
        if (sx < 0 || sx > width || sy < 0 || sy > height) continue;
        const tw = 0.5 + Math.sin(t*2 + s.twinkleOffset)*0.5; // twinkle factor 0-1
        const size = Math.max(0.4, (1 - s.z/width) * 3.2 * (0.3 + tw*0.7));
        // Draw trail (motion streak) for depth
        ctx.strokeStyle = `rgba(255,255,255,${0.18 + tw*0.55})`;
        ctx.lineWidth = size * 0.9;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        // Core point
        ctx.fillStyle = `rgba(255,255,255,${0.35 + tw*0.6})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.55, 0, Math.PI*2);
        ctx.fill();
      }
    };

    const paintStatic = (normalized: number) => {
      const backgroundShade = Math.round(lerp(0, 255, normalized));
      ctx.fillStyle = `rgb(${backgroundShade}, ${backgroundShade}, ${backgroundShade})`;
      ctx.fillRect(0,0,width,height);
      drawNebula();
      const cx = centerX(); const cy = centerY();
      for (const s of starsRef.current) {
        const k = 200; const sx = (s.x / s.z) * k + cx; const sy = (s.y / s.z) * k + cy;
        if (sx < 0 || sx > width || sy < 0 || sy > height) continue;
        const size = Math.max(0.4, (1 - s.z/width) * 2.2);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath(); ctx.arc(sx, sy, size*0.5, 0, Math.PI*2); ctx.fill();
      }
    };

    if (reduceMotion) { paintStatic(progressRef.current); return; }

    let last = performance.now();
    const loop = (now:number) => {
      const dt = Math.min(0.05, (now - last)/1000); // clamp delta
      last = now;
      const t = now/1000;
      warpStep(dt, t);
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);

    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); window.removeEventListener('resize', onResize); };
  }, [density, reduceMotion]);

  return <canvas ref={canvasRef} className={"absolute inset-0 w-full h-full " + (className||'')} aria-hidden="true" />;
};

export default Starfield;
