import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle, Info, Lock, Clock } from 'lucide-react';

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
      case 'low': return 'badge-low';
      case 'medium': return 'badge-medium';
      case 'high': return 'badge-high';
      default: return 'badge-inconclusive';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 60) return 'text-rose-500 from-rose-500 to-red-600';
    if (score >= 30) return 'text-amber-400 from-amber-400 to-yellow-500';
    return 'text-emerald-400 from-emerald-400 to-teal-500';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Risk Gauge Header Panel */}
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Score Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-slate-900 border-4 border-slate-800 shadow-inner">
              <div className="text-center">
                <span className={`text-4xl font-extrabold tracking-tight bg-gradient-to-tr ${getScoreColor(risk_score)} bg-clip-text text-transparent`}>
                  {risk_score}
                </span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                  / 100 Risk
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getBadgeClass(risk_level)}`}>
                  {risk_level} Impersonation Risk
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  ID: {event_id}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mt-2">
                {risk_level === 'high' && 'High Threat Warning Detected'}
                {risk_level === 'medium' && 'Elevated Caution Recommended'}
                {risk_level === 'low' && 'Standard Risk Level Detected'}
                {risk_level === 'inconclusive' && 'Inconclusive Analysis Evidence'}
              </h2>

              <p className="text-xs text-slate-400 mt-1 flex items-center gap-4">
                <span>Confidence: <strong className="text-slate-200 capitalize">{confidence_level}</strong></span>
                <span>•</span>
                <span>Synthetic Voice Probability: <strong className="text-cyan-300">{audio_analysis?.synthetic_probability ? `${Math.round(audio_analysis.synthetic_probability * 100)}%` : 'N/A'}</strong></span>
                {speaker_analysis?.available && (
                  <>
                    <span>•</span>
                    <span>Speaker Match: <strong className="text-indigo-300">{Math.round(speaker_analysis.similarity * 100)}%</strong></span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Privacy Enforced
            </span>
            <span className="text-[11px] text-slate-400 mt-1 max-w-[200px] text-right leading-tight">
              {privacy_status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Recommendation Box */}
      <div className={`glass-panel p-6 rounded-xl border ${
        risk_level === 'high' ? 'border-rose-500/30 bg-rose-950/20' : risk_level === 'medium' ? 'border-amber-500/30 bg-amber-950/20' : 'border-emerald-500/30 bg-emerald-950/20'
      }`}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-2">
          {risk_level === 'high' ? <ShieldAlert className="w-5 h-5 text-rose-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
          Recommended Protocol Action
        </h3>
        <p className="text-sm font-medium text-slate-100 leading-relaxed">
          {recommended_action}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reasons & Evidence Breakdown */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Risk Factor Contribution List
          </h3>

          <div className="space-y-3">
            {reasons?.map((reason, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    {reason.reason_code}
                  </span>
                  <p className="text-xs text-slate-300 font-medium mt-1.5 leading-snug">
                    {reason.message}
                  </p>
                </div>
                {reason.contribution > 0 && (
                  <span className="text-xs font-bold text-rose-400 bg-rose-950/50 px-2.5 py-1 rounded-md border border-rose-800/50 whitespace-nowrap">
                    +{reason.contribution} pts
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Segment Analysis Timeline */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            Audio Segment Synthetic Timeline
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {segments?.map((seg) => {
              const prob = seg.synthetic_probability || 0;
              const probPct = Math.round(prob * 100);
              return (
                <div key={seg.segment_number} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">
                      Segment #{seg.segment_number} ({seg.start_seconds}s - {seg.end_seconds}s)
                    </span>
                    <span className={`font-bold ${probPct >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {probPct}% Synthetic Prob
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        probPct >= 50 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
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
