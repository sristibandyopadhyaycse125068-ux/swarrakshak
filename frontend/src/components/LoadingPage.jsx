import React, { useEffect, useRef, useState } from 'react';

export default function LoadingPage({ onComplete }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Progress counter 0% -> 100% over 2.4s
    const startTime = Date.now();
    const duration = 2400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500); // 500ms fade transition
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Optical Art / Neural Grid Tunnel Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let step = 0;
    const render = () => {
      if (!prefersReducedMotion) {
        step += 0.015;
      }

      ctx.fillStyle = '#2C0F12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.7;

      // Draw concentric optical art tunnel rings (Burgundy & Red Wine)
      const numRings = 24;
      for (let i = 0; i < numRings; i++) {
        const factor = (i / numRings + (step * 0.2)) % 1;
        const radius = factor * maxRadius;
        const opacity = Math.sin(factor * Math.PI) * 0.7;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.lineWidth = 1.5 + (1 - factor) * 2;
        ctx.strokeStyle = `rgba(121, 12, 18, ${opacity})`;
        ctx.shadowColor = '#790C12';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      // Draw rotating geometric optical lines
      const numLines = 16;
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2 + step * 0.4;
        const x1 = cx + Math.cos(angle) * 40;
        const y1 = cy + Math.sin(angle) * 40;
        const x2 = cx + Math.cos(angle) * (maxRadius * 0.85);
        const y2 = cy + Math.sin(angle) * (maxRadius * 0.85);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(107, 30, 35, 0.25)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2C0F12] text-[#FFF7E1] transition-all duration-700 ${
        isFadingOut ? 'opacity-0 blur-lg scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Grain / Noise Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#790C12_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      {/* Center Biometric Loading Content */}
      <div className="relative z-10 text-center space-y-6 px-4">
        {/* Biometric Scan Ring */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="rgba(107, 30, 35, 0.4)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#790C12"
              strokeWidth="3.5"
              fill="none"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out drop-shadow-[0_0_12px_rgba(121,12,18,0.9)]"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-mono font-black tracking-widest text-[#FFF7E1]">
              {progress}%
            </span>
          </div>
        </div>

        {/* Brand Name */}
        <div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-[0.2em] font-['Space_Grotesk'] text-[#FFF7E1] glow-heading-wine uppercase">
            SWARRAKSHAK
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-[0.3em] text-[#FFF7E1]/80 uppercase mt-3">
            INITIALIZING SECURE TOPOLOGY
          </p>
        </div>

        {/* Pulsing Waveform Indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9].map((delay, idx) => (
            <span
              key={idx}
              className="w-1 h-6 bg-[#790C12] rounded-full animate-pulse shadow-[0_0_8px_#790C12]"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
