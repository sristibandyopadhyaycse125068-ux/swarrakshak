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
      case 'low': return 'bg-[#6B1E23] text-[#FFF7E1] border-[#FFF7E1]/40 shadow-lg';
      case 'medium': return 'bg-[#6B1E23] text-[#FFF7E1] border-[#790C12] shadow-lg';
      case 'high': return 'bg-[#790C12] text-[#FFF7E1] border-[#FFF7E1]/50 shadow-[0_0_20px_rgba(121,12,18,0.8)]';
      default: return 'bg-[#2C0F12] text-[#FFF7E1]/70 border-[#FFF7E1]/20';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn relative z-20 my-8">
      {/* Risk Gauge Header Panel */}
      <div className="glass-panel-wine p-8 sm:p-10 rounded-3xl border border-[#FFF7E1]/15 bg-[#2C0F12]/95 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-8">
            {/* Score Ring */}
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-[#6B1E23] border-4 border-[#790C12] shadow-[0_0_30px_rgba(121,12,18,0.6)] shrink-0">
              <div className="text-center">
                <span className="text-5xl font-black font-['Space_Grotesk'] tracking-tight text-[#FFF7E1] drop-shadow-[0_0_15px_rgba(255,247,225,0.8)]">
                  {risk_score}
                </span>
                <span className="block text-xs text-[#FFF7E1]/80 uppercase tracking-widest font-mono font-bold mt-1">
                  / 100 RISK
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-widest border ${getBadgeClass(risk_level)}`}>
                  {risk_level} Impersonation Risk
                </span>
                <span className="text-xs font-mono text-[#FFF7E1] flex items-center gap-1.5 bg-[#6B1E23] px-3 py-1 rounded-full border border-[#790C12]">
                  <Lock className="w-3.5 h-3.5 text-[#FFF7E1]" />
                  EVENT ID: #{event_id}
                </span>
              </div>

              <h2 className="text-3xl font-black text-[#FFF7E1] mt-3 font-['Space_Grotesk'] tracking-wide uppercase">
                {risk_level === 'high' && 'HIGH THREAT WARNING DETECTED'}
                {risk_level === 'medium' && 'ELEVATED CAUTION RECOMMENDED'}
                {risk_level === 'low' && 'AUTHENTIC LOW RISK SIGNAL DETECTED'}
                {risk_level === 'inconclusive' && 'INCONCLUSIVE EVIDENCE VECTOR'}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#FFF7E1]/90 mt-3 uppercase">
                <span>CONFIDENCE: <strong className="text-[#FFF7E1] font-bold">{confidence_level}</strong></span>
                <span>•</span>
                <span>SYNTHETIC PROBABILITY: <strong className="text-[#FFF7E1] font-bold">{audio_analysis?.synthetic_probability ? `${Math.round(audio_analysis.synthetic_probability * 100)}%` : 'N/A'}</strong></span>
                {speaker_analysis?.available && (
                  <>
                    <span>•</span>
                    <span>SPEAKER MATCH: <strong className="text-[#FFF7E1] font-bold">{Math.round(speaker_analysis.similarity * 100)}%</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B1E23] text-[#FFF7E1] border border-[#790C12] text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
              <CheckCircle className="w-4 h-4 text-[#FFF7E1]" />
              PRIVACY ENFORCED
            </span>
            <span className="text-xs font-mono text-[#FFF7E1]/70 mt-2 max-w-xs text-right leading-tight uppercase">
              {privacy_status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Recommendation Box */}
      <div className="glass-panel-wine p-8 rounded-3xl border border-[#790C12] bg-[#6B1E23]/60 text-[#FFF7E1] shadow-2xl backdrop-blur-2xl">
        <h3 className="text-sm font-mono font-black uppercase tracking-widest text-[#FFF7E1] flex items-center gap-2 mb-3">
          <ShieldAlert className="w-6 h-6 text-[#FFF7E1]" />
          RECOMMENDED PROTOCOL ACTION
        </h3>
        <p className="text-lg font-bold text-[#FFF7E1] leading-relaxed font-sans">
          {recommended_action}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reasons & Evidence Breakdown */}
        <div className="glass-panel-wine p-8 rounded-3xl space-y-6 border border-[#FFF7E1]/15 bg-[#2C0F12]/95 backdrop-blur-2xl">
          <h3 className="text-xl font-black text-[#FFF7E1] flex items-center gap-3 border-b border-[#FFF7E1]/10 pb-4 font-['Space_Grotesk'] uppercase">
            <AlertTriangle className="w-5 h-5 text-[#FFF7E1]" />
            RISK FACTOR CONTRIBUTION LIST
          </h3>

          <div className="space-y-4">
            {reasons?.map((reason, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#6B1E23]/40 border border-[#FFF7E1]/15 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold tracking-wider text-[#FFF7E1] uppercase bg-[#6B1E23] px-3 py-1 rounded-full border border-[#790C12]">
                    {reason.reason_code}
                  </span>
                  <p className="text-sm text-[#FFF7E1] font-medium mt-2 leading-relaxed font-sans">
                    {reason.message}
                  </p>
                </div>
                {reason.contribution > 0 && (
                  <span className="text-xs font-mono font-bold text-[#FFF7E1] bg-[#790C12] px-3 py-1.5 rounded-full border border-[#FFF7E1]/30 whitespace-nowrap shadow-md">
                    +{reason.contribution} PTS
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Segment Analysis Timeline */}
        <div className="glass-panel-wine p-8 rounded-3xl space-y-6 border border-[#FFF7E1]/15 bg-[#2C0F12]/95 backdrop-blur-2xl">
          <h3 className="text-xl font-black text-[#FFF7E1] flex items-center gap-3 border-b border-[#FFF7E1]/10 pb-4 font-['Space_Grotesk'] uppercase">
            <Clock className="w-5 h-5 text-[#FFF7E1]" />
            AUDIO SEGMENT SYNTHETIC TIMELINE
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {segments?.map((seg) => {
              const prob = seg.synthetic_probability || 0;
              const probPct = Math.round(prob * 100);
              return (
                <div key={seg.segment_number} className="p-4 rounded-2xl bg-[#6B1E23]/40 border border-[#FFF7E1]/15">
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="font-bold text-[#FFF7E1]">
                      Segment #{seg.segment_number} ({seg.start_seconds}s - {seg.end_seconds}s)
                    </span>
                    <span className="font-bold text-[#FFF7E1]">
                      {probPct}% Synthetic Prob
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-[#2C0F12] h-3 rounded-full overflow-hidden border border-[#FFF7E1]/15">
                    <div
                      className="h-full transition-all duration-500 bg-[#790C12] shadow-lg"
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
