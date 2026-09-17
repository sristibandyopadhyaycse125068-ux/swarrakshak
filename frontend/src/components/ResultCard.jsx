import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle, Lock, Clock, Sparkles } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) return null;

  const {
    event_id,
    risk_score,
    risk_level,
    confidence_level,
    audio_analysis,
    speaker_analysis,
    reasons,
    segments,
    recommended_action,
    privacy_status
  } = result;

  const getBadgeClass = (level) => {
    switch (level) {
      case 'low': return 'bg-emerald-950/90 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'medium': return 'bg-amber-950/90 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'high': return 'bg-rose-950/90 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
      default: return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 60) return 'text-rose-400 from-rose-400 to-red-500';
    if (score >= 30) return 'text-amber-400 from-amber-400 to-yellow-500';
    return 'text-emerald-400 from-emerald-400 to-teal-400';
  };

  return (
    <div className="space-y-8 animate-fadeIn relative z-20 my-8">
      {/* Risk Gauge Header Panel */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/40 bg-[#080812]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,240,255,0.1)]">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-8">
            {/* Score Ring */}
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-[#0d0e1c] border-4 border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.2)] shrink-0">
              <div className="text-center">
                <span className={`text-5xl font-black font-['Space_Grotesk'] tracking-tight bg-gradient-to-tr ${getScoreColor(risk_score)} bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]`}>
                  {risk_score}
                </span>
                <span className="block text-xs text-slate-400 uppercase tracking-widest font-mono font-bold mt-1">
                  / 100 RISK
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-widest border ${getBadgeClass(risk_level)}`}>
                  {risk_level} Impersonation Risk
                </span>
                <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  EVENT ID: #{event_id}
                </span>
              </div>

              <h2 className="text-3xl font-black text-white mt-3 font-['Space_Grotesk'] tracking-wide">
                {risk_level === 'high' && 'HIGH THREAT WARING DETECTED'}
                {risk_level === 'medium' && 'ELEVATED CAUTION RECOMMENDED'}
                {risk_level === 'low' && 'AUTHENTIC LOW RISK SIGNAL DETECTED'}
                {risk_level === 'inconclusive' && 'INCONCLUSIVE EVIDENCE VECTOR'}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 mt-3">
                <span>CONFIDENCE: <strong className="text-white uppercase font-bold">{confidence_level}</strong></span>
                <span>•</span>
                <span>SYNTHETIC PROBABILITY: <strong className="text-cyan-300 font-bold">{audio_analysis?.synthetic_probability ? `${Math.round(audio_analysis.synthetic_probability * 100)}%` : 'N/A'}</strong></span>
                {speaker_analysis?.available && (
                  <>
                    <span>•</span>
                    <span>SPEAKER MATCH: <strong className="text-indigo-300 font-bold">{Math.round(speaker_analysis.similarity * 100)}%</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              PRIVACY ENFORCED
            </span>
            <span className="text-xs font-mono text-slate-400 mt-2 max-w-xs text-right leading-tight">
              {privacy_status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Recommendation Box */}
      <div className={`glass-panel p-8 rounded-3xl border shadow-xl backdrop-blur-2xl ${
        risk_level === 'high' ? 'border-rose-500/50 bg-rose-950/40 text-rose-100 shadow-[0_0_40px_rgba(244,63,94,0.15)]' : risk_level === 'medium' ? 'border-amber-500/50 bg-amber-950/40 text-amber-100 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
      }`}>
        <h3 className="text-sm font-mono font-black uppercase tracking-widest text-white flex items-center gap-2 mb-3">
          {risk_level === 'high' ? <ShieldAlert className="w-6 h-6 text-rose-400" /> : <ShieldCheck className="w-6 h-6 text-emerald-400" />}
          RECOMMENDED PROTOCOL ACTION
        </h3>
        <p className="text-lg font-bold text-white leading-relaxed font-sans">
          {recommended_action}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reasons & Evidence Breakdown */}
        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-white/10 bg-[#080812]/95 backdrop-blur-2xl">
          <h3 className="text-xl font-black text-white flex items-center gap-3 border-b border-white/10 pb-4 font-['Space_Grotesk']">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            RISK FACTOR CONTRIBUTION LIST
          </h3>

          <div className="space-y-4">
            {reasons?.map((reason, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#0d0e1c] border border-white/10 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                    {reason.reason_code}
                  </span>
                  <p className="text-sm text-slate-200 font-medium mt-2 leading-relaxed font-sans">
                    {reason.message}
                  </p>
                </div>
                {reason.contribution > 0 && (
                  <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 px-3 py-1.5 rounded-full border border-rose-500/40 whitespace-nowrap shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                    +{reason.contribution} PTS
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Segment Analysis Timeline */}
        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-white/10 bg-[#080812]/95 backdrop-blur-2xl">
          <h3 className="text-xl font-black text-white flex items-center gap-3 border-b border-white/10 pb-4 font-['Space_Grotesk']">
            <Clock className="w-5 h-5 text-cyan-400" />
            AUDIO SEGMENT SYNTHETIC TIMELINE
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {segments?.map((seg) => {
              const prob = seg.synthetic_probability || 0;
              const probPct = Math.round(prob * 100);
              return (
                <div key={seg.segment_number} className="p-4 rounded-2xl bg-[#0d0e1c] border border-white/10">
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="font-bold text-slate-200">
                      Segment #{seg.segment_number} ({seg.start_seconds}s - {seg.end_seconds}s)
                    </span>
                    <span className={`font-bold ${probPct >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {probPct}% Synthetic Prob
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full transition-all duration-500 ${
                        probPct >= 50 ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      }`}
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

