import React from 'react';
import { Play, Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export default function DemoPresetLoader({ onSelectPreset }) {
  const presets = [
    {
      id: 'genuine',
      title: 'Executive Voiceprint A',
      subtitle: 'AUTHENTIC HUMAN VOICE',
      desc: 'Verified executive routine voice telemetry with standard protocol compliance and low transaction risk.',
      badge: 'Low Risk • 99.4% Match',
      badgeClass: 'bg-[#6B1E23]/80 text-[#FFF7E1] border-[#FFF7E1]/30 shadow-[0_0_12px_rgba(255,247,225,0.15)]',
      icon: CheckCircle2,
      accentGlow: 'hover:border-[#FFF7E1]/50 hover:shadow-[0_0_25px_rgba(255,247,225,0.2)]',
      context: {
        caller_number_status: 'known',
        request_urgency: 'normal',
        transaction_value: 'low',
        procedure_status: 'normal',
        caller_relationship: 'vendor',
        notes: 'Verified natural acoustic harmonics and matched biometric signature.'
      }
    },
    {
      id: 'cloned_high_risk',
      title: 'Deepfake Spoof Vector B',
      subtitle: 'SYNTHETIC CLONE ATTACK',
      desc: 'Neural vocoder phase noise & zero-shot voice clone attempting urgent $500k wire transfer bypass.',
      badge: 'High Risk • Clone Detected',
      badgeClass: 'bg-[#790C12] text-[#FFF7E1] border-[#FFF7E1]/40 shadow-[0_0_15px_rgba(121,12,18,0.7)]',
      icon: ShieldAlert,
      accentGlow: 'hover:border-[#790C12] hover:shadow-[0_0_30px_rgba(121,12,18,0.5)]',
      context: {
        caller_number_status: 'unknown',
        request_urgency: 'urgent',
        transaction_value: 'high',
        procedure_status: 'bypass_requested',
        caller_relationship: 'executive',
        notes: 'Urgent wire transfer request with synthetic spectral anomalies.'
      }
    },
    {
      id: 'suspicious_context',
      title: 'Synthetic Voice Attack C',
      subtitle: 'ELEVATED ANOMALY VECTOR',
      desc: 'Natural sounding synthetic voice with hidden caller ID requesting security procedure overrides.',
      badge: 'Medium Risk • Anomaly',
      badgeClass: 'bg-[#6B1E23] text-[#FFF7E1] border-[#790C12] shadow-[0_0_12px_rgba(107,30,35,0.5)]',
      icon: AlertTriangle,
      accentGlow: 'hover:border-[#6B1E23] hover:shadow-[0_0_25px_rgba(107,30,35,0.4)]',
      context: {
        caller_number_status: 'hidden',
        request_urgency: 'urgent',
        transaction_value: 'medium',
        procedure_status: 'bypass_requested',
        caller_relationship: 'customer',
        notes: 'Hidden caller ID with requested authorization bypass.'
      }
    }
  ];

  return (
    <div className="glass-panel-wine p-6 sm:p-8 rounded-3xl space-y-6 border border-[#FFF7E1]/15 shadow-2xl bg-[#2C0F12]/90 backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FFF7E1]/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#6B1E23] text-[#FFF7E1] border border-[#790C12]">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#FFF7E1] flex items-center gap-2 font-['Space_Grotesk'] tracking-wide">
              AUDIO SPECTRUM SCENARIO MATRIX
            </h3>
            <p className="text-xs text-[#FFF7E1]/70 font-mono tracking-wider">
              SELECT PRE-RECORDED DEMO PROFILES TO BENCHMARK THE CLASSIFICATION ENGINE
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-[#6B1E23] text-[#FFF7E1] border border-[#790C12] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FFF7E1]" />
          1-CLICK DEMO SUITE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {presets.map((p) => {
          const IconComponent = p.icon;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPreset(p)}
              className={`p-6 rounded-2xl bg-[#2C0F12] border border-[#FFF7E1]/15 ${p.accentGlow} transition-all duration-300 cursor-pointer group flex flex-col justify-between backdrop-blur-xl hover:-translate-y-1 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#790C12]/10 rounded-full blur-2xl group-hover:bg-[#790C12]/25 transition-all duration-500" />
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${p.badgeClass} flex items-center gap-1.5`}>
                    <IconComponent className="w-3.5 h-3.5" />
                    {p.badge}
                  </span>
                  <div className="p-2 rounded-full bg-[#6B1E23] border border-[#790C12] text-[#FFF7E1] group-hover:scale-110 group-hover:bg-[#790C12] transition-all duration-300">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <h4 className="text-lg font-black text-[#FFF7E1] group-hover:text-[#FFF7E1] transition-colors duration-300 font-['Space_Grotesk'] mb-1">
                  {p.title}
                </h4>
                <p className="text-[10px] font-mono tracking-widest text-[#FFF7E1]/80 uppercase font-semibold mb-3">
                  {p.subtitle}
                </p>
                <p className="text-xs text-[#FFF7E1]/80 leading-relaxed font-sans mb-6">
                  {p.desc}
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl bg-[#6B1E23] hover:bg-[#790C12] text-[#FFF7E1] text-xs font-mono font-bold tracking-wider uppercase border border-[#790C12] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                Execute Profile
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


