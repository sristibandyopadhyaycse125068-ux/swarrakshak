import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ isPlaying = false, audioRef }) {
  const canvasRef = useRef(null);
  const animIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = 0;

    const render = () => {
      animIdRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw Background Frequency Bars
      const numBars = 32;
      const barWidth = (width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        const h = isPlaying
          ? (Math.sin(phase + i * 0.3) * 0.4 + 0.5) * (height * 0.6) + Math.random() * 8
          : (Math.sin(phase * 0.5 + i * 0.2) * 0.15 + 0.2) * (height * 0.2);

        const x = i * (barWidth + 2);
        const y = height - h;

        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(0, 114, 255, 0.2)');
        grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.6)');
        grad.addColorStop(1, 'rgba(255, 0, 85, 0.8)');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, h);
      }

      // Draw Smooth Center Waveform Line
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;

      const cy = height / 2;
      for (let x = 0; x < width; x += 3) {
        const amp = isPlaying ? 18 : 6;
        const freq = isPlaying ? 0.05 : 0.02;
        const y = cy + Math.sin(x * freq + phase * 3) * amp * Math.cos(x * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isPlaying ? 0.08 : 0.03;
    };

    render();

    return () => {
      cancelAnimationFrame(animIdRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-24 rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden shadow-inner">
      <canvas
        ref={canvasRef}
        width={600}
        height={96}
        className="w-full h-full block"
      />
    </div>
  );
}
