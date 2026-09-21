import React, { useEffect, useState } from 'react';

export default function LoadingPage({ onComplete }) {
  const [progress, setProgress] = useState(1);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1 to 100 percentage counter over 2.5s total load duration
    const duration = 2500;
    const stepTime = duration / 100;
    let current = 1;

    const interval = setInterval(() => {
      current++;
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500); // smooth fade transition
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050203] text-white transition-all duration-700 ${
        isFadingOut ? 'opacity-0 blur-lg scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(107,30,35,0.25)_0%,transparent_70%)] pointer-events-none" />

      {/* Uiverse Crimson Loader Wrapper */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="loader-wrapper">
          <div className="loader"></div>
          <div className="loader-content">
            <span className="counter" id="loadingCounter">{progress}%</span>
            <span className="loader-sub">INITIALIZING</span>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-black tracking-[0.25em] font-['Space_Grotesk'] text-white uppercase drop-shadow-[0_0_20px_rgba(225,29,72,0.4)]">
            SWARRAKSHAK
          </h1>
          <p className="text-xs font-mono tracking-[0.3em] text-[#e2a9af]/80 uppercase mt-2">
            BIOMETRIC VOICE RISK ENGINE
          </p>
        </div>
      </div>

      <style font-sans="true">{`
        .loader-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background-color: transparent;
          user-select: none;
        }

        .loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background-color: transparent;
          animation: loader-rotate 2.4s linear infinite;
          z-index: 0;
        }

        @keyframes loader-rotate {
          0% {
            transform: rotate(0deg);
            box-shadow:
              0 8px 18px 0 rgba(255, 255, 255, 0.8) inset,
              0 20px 30px 0 #a1232b inset,
              0 50px 60px 0 #2c0f12 inset;
          }
          50% {
            transform: rotate(180deg);
            box-shadow:
              0 8px 18px 0 rgba(255, 255, 255, 0.8) inset,
              0 20px 35px 0 #e11d48 inset,
              0 50px 60px 0 #6b1e23 inset;
          }
          100% {
            transform: rotate(360deg);
            box-shadow:
              0 8px 18px 0 rgba(255, 255, 255, 0.8) inset,
              0 20px 30px 0 #a1232b inset,
              0 50px 60px 0 #2c0f12 inset;
          }
        }

        .loader-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .counter {
          font-family: "Space Grotesk", "Plus Jakarta Sans", "Inter", sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #ffffff;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 20px rgba(225, 29, 72, 0.5);
        }

        .loader-sub {
          font-family: "Space Grotesk", "Plus Jakarta Sans", "Inter", sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: #e2a9af;
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
}

