import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Lock, CheckCircle2, Zap, Radio, ArrowDown } from 'lucide-react';

export default function NeuralTelemetrySection({ onEnterDashboard }) {
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
    // Animating 0% -> 99.4%
    const duration = 2000;
    const steps = 60;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const currentVal = (step / steps) * 99.4;
      setConfidenceScore(Math.min(99.4, currentVal));
      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
          Neural Morph Verification Stream
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Neural Compliance & Biometric Telemetry
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Synchronizing spatial acoustic spectral signatures with neural embedding layers.
        </p>
      </motion.div>

      {/* Floating HUD Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full mx-auto">
        {/* Left HUD Card: Live Biometric Confidence Counter */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-panel p-8 flex flex-col justify-between border-cyan-500/30 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              Biometric Confidence Scan
            </span>
            <span className="text-[10px] font-mono text-slate-500">REF_TELEMETRY_099</span>
          </div>

          <div className="my-6 text-center">
            <div className="text-6xl sm:text-7xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 glow-text-cyan">
              {confidenceScore.toFixed(1)}%
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-2">
              Neural Signature Match Confidence
            </p>
          </div>

          <div className="w-full bg-slate-900/80 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </motion.div>

        {/* Right HUD Card: Live Telemetry Metric Chips */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="glass-panel p-8 space-y-4 border-indigo-500/30 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Cryptographic Integrity Status
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              ACTIVE
            </span>
          </div>

          <div className="space-y-3">
            {/* Status Chip 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-bold font-mono text-cyan-300">[Status: TEST VERIFIED]</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>

            {/* Status Chip 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold font-mono text-slate-200">[Integrity: SECURED]</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded">
                AES-256
              </span>
            </div>

            {/* Status Chip 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono text-slate-200">[Telemetry: REAL-TIME STREAM ACTIVE]</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">60 FPS</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Down Navigation Indicator Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-12 text-center"
      >
        <button
          onClick={onEnterDashboard}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-bold tracking-wider uppercase transition-all shadow-lg hover:scale-105"
        >
          <span>Launch Operational Dashboard</span>
          <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
}
