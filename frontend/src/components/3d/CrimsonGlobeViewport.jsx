import React, { useEffect, useRef } from 'react';

export default function CrimsonGlobeViewport() {
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const starCanvasRef = useRef(null);

  // 1. Edge-to-Edge Starfield Generator with Flank Weighting & Subtle Twinkle
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const starCount = 180;
    const stars = [];

    const createStar = () => {
      // Weight distribution slightly towards left and right flanks to fill video voids
      let x;
      const rand = Math.random();
      if (rand < 0.4) {
        x = Math.random() * (width * 0.3); // Left flank
      } else if (rand < 0.8) {
        x = width * 0.7 + Math.random() * (width * 0.3); // Right flank
      } else {
        x = Math.random() * width; // Center void
      }

      return {
        x,
        y: Math.random() * height,
        radius: Math.random() * 0.9 + 0.5, // 0.5px to 1.4px
        baseAlpha: Math.random() * 0.6 + 0.25, // 0.25 to 0.85
        alpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: Math.random() > 0.75 ? '#ffd4d8' : '#ffffff'
      };
    };

    for (let i = 0; i < starCount; i++) {
      stars.push(createStar());
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.85 || star.alpha < 0.25) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1.0, star.alpha));
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 2. Video Loop Controller
  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videoA.removeAttribute('autoplay');
      videoA.pause();
      videoB.pause();
      try { videoA.currentTime = 0; } catch (e) {}
      return;
    }

    const FADE = 0.9;
    let cur = videoA;
    let nxt = videoB;
    let swapping = false;

    const playVideo = (v) => {
      const p = v.play();
      if (p && p.catch) { p.catch(() => {}); }
    };

    playVideo(videoA);

    const tick = () => {
      if (swapping || !cur.duration) return;
      if (cur.duration - cur.currentTime > FADE) return;

      swapping = true;
      const out = cur;

      nxt.currentTime = 0;
      playVideo(nxt);
      nxt.classList.add('is-active');
      out.classList.remove('is-active');

      cur = nxt;
      nxt = out;

      setTimeout(() => {
        out.pause();
        try { out.currentTime = 0; } catch (e) {}
        swapping = false;
      }, FADE * 1000 + 100);
    };

    videoA.addEventListener('timeupdate', tick);
    videoB.addEventListener('timeupdate', tick);

    return () => {
      if (videoA) videoA.removeEventListener('timeupdate', tick);
      if (videoB) videoB.removeEventListener('timeupdate', tick);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {/* Video Container Layer (z-index: 1) */}
      <div 
        className="bg"
        role="img" 
        aria-label="Stylised globe of Earth rendered as a dot matrix against a starfield, slowly rotating"
      >
        <video 
          ref={videoARef}
          className="bg-video is-active" 
          id="bgVideoA" 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="auto" 
          disablePictureInPicture 
          aria-hidden="true" 
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4" type="video/mp4" />
        </video>
        <video 
          ref={videoBRef}
          className="bg-video" 
          id="bgVideoB" 
          muted 
          loop 
          playsInline 
          preload="auto" 
          disablePictureInPicture 
          aria-hidden="true" 
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Flank-Weighted Starfield Overlay (z-index: 2) */}
      <canvas 
        ref={starCanvasRef} 
        id="starfield"
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 2 }}
      />

      <style font-sans="true">{`
        .bg {
          position: absolute !important;
          left: 50% !important;
          bottom: -6vh !important;
          top: auto !important;
          transform: translateX(-50%) !important;
          width: 100vw !important;
          max-width: none !important;
          height: 88vh !important;
          overflow: visible !important;
          z-index: 1 !important;
        }

        .bg::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background: radial-gradient(
            circle at 50% 100%,
            rgba(107, 30, 35, 0.45) 0%,
            rgba(44, 15, 18, 0.25) 45%,
            rgba(5, 2, 3, 0.85) 85%
          );
          mix-blend-mode: color-burn;
        }

        .bg-video {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          object-position: center bottom !important;
          transform: scale(0.94) !important;
          transform-origin: center bottom !important;
          pointer-events: none !important;
          background-color: transparent !important;
          opacity: 0;
          transition: opacity 0.9s linear;
          filter: hue-rotate(88deg) saturate(1.6) brightness(0.82) contrast(1.18) !important;
        }

        .bg-video.is-active {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}







