import React from 'react';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

export default function DemoPresetLoader({ onSelectPreset }) {
  const presets = [
    {
      id: 'genuine',
      title: '1. Genuine Call (Low Risk)',
      desc: 'Verified supplier routine call with standard procedures and low transaction value.',
      badge: 'Low Risk',
      badgeClass: 'badge-low',
      context: {
        caller_number_status: 'known',
        request_urgency: 'normal',
        transaction_value: 'low',
        procedure_status: 'normal',
        caller_relationship: 'vendor',
        notes: 'Demo: Verified supplier routine check'
      }
    },
    {
      id: 'cloned_high_risk',
      title: '2. Cloned Voice (High Risk)',
      desc: 'Synthetic CFO voice requesting urgent $500k wire transfer to an unknown account.',
      badge: 'High Risk',
      badgeClass: 'badge-high',
      context: {
        caller_number_status: 'unknown',
        request_urgency: 'urgent',
        transaction_value: 'high',
        procedure_status: 'bypass_requested',
        caller_relationship: 'executive',
        notes: 'Demo: Suspicious voice clone asking for wire transfer'
      }
    },
    {
      id: 'suspicious_context',
      title: '3. Suspicious Context (Medium Risk)',
      desc: 'Natural sounding voice from unknown number asking to bypass authorization.',
      badge: 'Medium Risk',
      badgeClass: 'badge-medium',
      context: {
        caller_number_status: 'hidden',
        request_urgency: 'urgent',
        transaction_value: 'medium',
        procedure_status: 'bypass_requested',
        caller_relationship: 'customer',
        notes: 'Demo: Natural speaker but hidden caller ID and bypass request'
      }
    }
  ];

  return (
    <div className="glass-panel p-8 space-y-6 my-6 border border-cyan-500/20 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Hackathon Prepared Demo Scenarios
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Click any scenario button below to load test audio & context, and immediately run the detection engine.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
          Instant 1-Click Demo Trigger
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {presets.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectPreset(p)}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 transition-all duration-300 cursor-pointer group flex flex-col justify-between hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md ${p.badgeClass}`}>
                  {p.badge}
                </span>
                <Play className="w-4 h-4 text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition mb-2">
                {p.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {p.desc}
              </p>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-950/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold border border-cyan-800/80 transition flex items-center justify-center gap-2 shadow-sm"
            >
              Run {p.badge} Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
