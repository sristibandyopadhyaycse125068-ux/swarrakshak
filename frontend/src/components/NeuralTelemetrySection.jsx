import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Lock, CheckCircle2, Zap, Radio, ArrowRight } from 'lucide-react';

export default function NeuralTelemetrySection({ onProceedDashboard, onEnterDashboard }) {
  const handleProceed = onProceedDashboard || onEnterDashboard;
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
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
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 z-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
          Neural Morph Verification Stream
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Probabilistic Biometric Telemetry
        </h2>
        <p className="text-slate-300 text-base sm:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
          Synchronizing spatial acoustic spectral signatures with neural embedding layers in real-time.
        </p>
      </motion.div>

      {/* Floating HUD Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full mx-auto">
        {/* Left HUD Card: Live Biometric Confidence Counter */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-panel p-8 sm:p-10 flex flex-col justify-between border-cyan-500/40 relative overflow-hidden bg-[#080812]/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.1)] rounded-3xl"
        >
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <span className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              Biometric Confidence
            </span>
            <span className="text-xs font-mono text-slate-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
              CONFIDENCE_STREAM_099
            </span>
          </div>

          <div className="my-8 text-center">
            <div className="text-7xl sm:text-8xl font-black font-['Space_Grotesk'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 drop-shadow-[0_0_40px_rgba(0,240,255,0.5)]">
              {confidenceScore.toFixed(1)}%
            </div>
            <p className="text-xs sm:text-sm font-mono font-bold text-cyan-300 uppercase tracking-widest mt-4">
              Neural Signature Confidence Score
            </p>
          </div>

          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(0,240,255,0.8)]"
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
          className="glass-panel p-8 sm:p-10 space-y-6 border-indigo-500/40 relative overflow-hidden bg-[#080812]/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(123,44,191,0.15)] rounded-3xl"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <span className="text-xs sm:text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Cryptographic Verification Chips
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
              STREAM ACTIVE
            </span>
          </div>

          <div className="space-y-4">
            {/* Chip 1 */}
            <div className="p-4 rounded-2xl bg-[#0d0e1c] border border-cyan-500/30 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300">[Status: TEST VERIFIED]</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>

            {/* Chip 2 */}
            <div className="p-4 rounded-2xl bg-[#0d0e1c] border border-indigo-500/30 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-indigo-400" />
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-100">[Integrity: SECURED]</span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
                AES-256
              </span>
            </div>

            {/* Chip 3 */}
            <div className="p-4 rounded-2xl bg-[#0d0e1c] border border-emerald-500/30 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-100">[Telemetry: REAL-TIME STREAM ACTIVE]</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">60 FPS</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-12 text-center relative z-30"
      >
        <button
          type="button"
          onClick={handleProceed}
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-black text-base sm:text-lg tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Launch Verification Dashboard</span>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
      </motion.div>
    </section>
  );
}

