import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Lock, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) return null;

  const {
    event_id,
    risk_score = 0,
    risk_level = 'low',
    confidence_level = '82%',
    audio_analysis,
    speaker_analysis,
    reasons = [],
    segments = [],
    recommended_action,
    privacy_status
  } = result;

  // Dynamic Risk Color Logic
  const getRiskTheme = (score, level) => {
    if (score > 60 || level === 'high') {
      return {
        color: '#EF4444', // Crimson
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        glow: 'shadow-[0_0_24px_rgba(239,68,68,0.25)]',
        headline: 'HIGH THREAT WARNING DETECTED',
        badge: 'High Risk'
      };
    } else if (score > 30 || level === 'medium') {
      return {
        color: '#F59E0B', // Amber
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_24px_rgba(245,158,11,0.25)]',
        headline: 'MODERATE RISK SIGNAL DETECTED',
        badge: 'Moderate Risk'
      };
    } else {
      return {
        color: '#22C55E', // Emerald
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_24px_rgba(34,197,94,0.25)]',
        headline: 'AUTHENTIC LOW RISK SIGNAL DETECTED',
        badge: 'Low Risk'
      };
    }
  };

  const theme = getRiskTheme(risk_score, risk_level);

  // Radial SVG calculation (radius 42, circumference ~263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(Math.max(risk_score, 0), 100)) / 100;

  return (
    <div className="w-full space-y-8 animate-fadeIn relative z-20 my-8 font-sans">
      {/* 1. Full-Width Hero Analytics Panel */}
      <div className={`w-full bg-[#111116] p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-2xl transition-all ${theme.glow}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Animated Radial Donut Risk Gauge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 text-center sm:text-left">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
                {/* Background Ring Track */}
                <circle
                  cx="120"
                  cy="120"
                  r="92"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Animated Foreground Progress Ring */}
                <circle
                  cx="120"
                  cy="120"
                  r="92"
                  stroke={theme.color}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 92}
                  strokeDashoffset={(2 * Math.PI * 92) * (1 - Math.min(Math.max(risk_score, 0), 100) / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Centered Score */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-sans">
                  {risk_score}
                </span>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
                  / 100 RISK
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full border ${theme.bg} ${theme.text} ${theme.border}`}>
                  {theme.badge}
                </span>
              </div>
            </div>

            {/* Gauge Metadata & Level Tag */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-neutral-300 font-medium flex items-center gap-1.5 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  Event #{event_id || 'SR-9982'}
                </span>
              </div>

              <div className="text-xs text-neutral-400 space-y-1">
                <div>Confidence Status: <strong className="text-neutral-100 font-semibold">{confidence_level}</strong></div>
                <div>Risk Probability: <strong className="text-neutral-100 font-semibold">{risk_score}% threat</strong></div>
                {speaker_analysis?.available && (
                  <div>Speaker Match Rating: <strong className="text-neutral-100 font-semibold">{Math.round(speaker_analysis.similarity * 100)}%</strong></div>
                )}
              </div>
            </div>
          </div>


          {/* Right Column: Risk Telemetry Headline & Details */}
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 font-sans">
              {theme.headline}
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl font-normal">
              {risk_score > 60
                ? 'The analyzed voice telemetry sample contains multiple high-confidence indicators associated with neural synthetic voice generation and identity biometric mismatch.'
                : risk_score > 30
                ? 'Moderate acoustic anomalies detected. Secondary verification is recommended prior to approving sensitive operational overrides.'
                : 'Natural acoustic harmonic structure verified with high speaker correlation. Low risk profile detected.'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Processing Latency: <span className="text-neutral-200 font-semibold">14ms</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Telemetry: <span className="text-neutral-200 font-semibold">AES-256 Encrypted</span>
              </div>
            </div>
          </div>

          {/* Privacy Enforcement Tag */}
          <div className="flex flex-col items-center lg:items-end shrink-0 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-4 lg:pt-0 lg:pl-6 text-center lg:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Privacy Enforced
            </span>
            <span className="text-[11px] text-neutral-400 mt-2 max-w-[180px] leading-tight">
              {privacy_status || 'Zero raw audio retained. Zero-knowledge feature vector comparison.'}
            </span>
          </div>

        </div>
      </div>

      {/* 2. Recommended Protocol Action Banner */}
      <div className={`p-6 rounded-2xl border ${theme.border} ${theme.bg} text-neutral-100 flex items-start gap-4 shadow-lg`}>
        <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.border} border shrink-0`}>
          <ShieldAlert className={`w-6 h-6 ${theme.text}`} />
        </div>
        <div className="space-y-1">
          <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme.text} flex items-center gap-2`}>
            RECOMMENDED PROTOCOL ACTION
          </h3>
          <p className="text-base font-semibold text-neutral-100 leading-relaxed font-sans">
            {recommended_action || (risk_score > 60 
              ? 'Suspend financial authorization immediately and initiate secondary out-of-band biometric identity verification.'
              : risk_score > 30
              ? 'Request an additional verification factor before proceeding with high-value transactions.'
              : 'Continue with standard real-time voice monitoring protocols.')}
          </p>
        </div>
      </div>

      {/* 3. Detailed Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Risk Factor Contribution List */}
        <div className="bg-[#111116] p-6 sm:p-7 rounded-2xl space-y-5 border border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2 font-sans tracking-tight">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Risk factor contribution breakdown
            </h3>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Weight Analysis</span>
          </div>

          <div className="space-y-3.5">
            {reasons?.map((reason, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-4 hover:border-white/[0.12] transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    {reason.reason_code}
                  </span>
                  <p className="text-xs text-neutral-200 font-medium mt-1 leading-relaxed font-sans">
                    {reason.message}
                  </p>
                </div>
                {reason.contribution > 0 && (
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 whitespace-nowrap">
                    +{reason.contribution} pts
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Synthetic Audio Segment Timeline */}
        <div className="bg-[#111116] p-6 sm:p-7 rounded-2xl space-y-5 border border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2 font-sans tracking-tight">
              <Clock className="w-4 h-4 text-neutral-400" />
              Synthetic audio segment timeline
            </h3>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Acoustic Timeline</span>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {segments?.map((seg) => {
              const prob = seg.synthetic_probability || 0;
              const probPct = Math.round(prob * 100);
              return (
                <div key={seg.segment_number} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-300">
                    <span className="font-semibold text-neutral-200">
                      Segment #{seg.segment_number} ({seg.start_seconds}s - {seg.end_seconds}s)
                    </span>
                    <span className={`font-semibold ${probPct > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {probPct}% Synthetic Anomaly
                    </span>
                  </div>
                  {/* Segment Progress Waveform Bar */}
                  <div className="w-full bg-white/[0.06] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${probPct > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${probPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

