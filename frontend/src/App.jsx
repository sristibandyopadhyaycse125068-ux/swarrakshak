import React, { useState, useEffect } from 'react';
import CosmicCanvas from './components/3d/CosmicCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import NeuralTelemetrySection from './components/NeuralTelemetrySection';
import AudioUpload from './components/AudioUpload';
import ContextForm from './components/ContextForm';
import ResultCard from './components/ResultCard';
import DemoPresetLoader from './components/DemoPresetLoader';
import AnalystPortal from './components/AnalystPortal';
import InfoOverview from './components/InfoOverview';
import AudioVisualizer from './components/AudioVisualizer';
import { checkHealth, submitAnalysis } from './services/api';
import { ShieldCheck, Loader2, ArrowRight, Activity, Radio, Lock, Zap, Clock, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activePhase, setActivePhase] = useState(1);
  const [health, setHealth] = useState(null);

  // Form State
  const [currentFile, setCurrentFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [context, setContext] = useState({
    caller_number_status: 'known',
    request_urgency: 'normal',
    transaction_value: 'low',
    procedure_status: 'normal',
    caller_relationship: 'customer',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    checkHealth().then(setHealth);
  }, []);

  const createSyntheticWavBlob = (presetType = 'genuine') => {
    const sr = 16000;
    const duration = 2.0;
    const numSamples = sr * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sr;
      let sample = 0;
      if (presetType === 'cloned_high_risk') {
        const voice = Math.sin(2 * Math.PI * 160 * t);
        const noise = (Math.random() * 2 - 1) * 0.45;
        sample = (voice * 0.5 + noise) * 12000;
      } else if (presetType === 'suspicious_context') {
        const voice = Math.sin(2 * Math.PI * 180 * t) + 0.3 * Math.sin(2 * Math.PI * 360 * t);
        const noise = (Math.random() * 2 - 1) * 0.15;
        sample = (voice * 0.7 + noise) * 10000;
      } else {
        const f0 = 130 + 15 * Math.sin(2 * Math.PI * 3 * t);
        const voice = Math.sin(2 * Math.PI * f0 * t) + 0.5 * Math.sin(4 * Math.PI * f0 * t);
        const envelope = Math.sin(2 * Math.PI * 0.8 * t) > -0.2 ? 1 : 0;
        sample = voice * envelope * 10000;
      }
      view.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, sample)), true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const runDetectionWithParams = async (audioFile, contextObj) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('current_audio', audioFile);
      if (referenceFile) {
        formData.append('reference_audio', referenceFile);
      }
      formData.append('caller_number_status', contextObj.caller_number_status);
      formData.append('request_urgency', contextObj.request_urgency);
      formData.append('transaction_value', contextObj.transaction_value);
      formData.append('procedure_status', contextObj.procedure_status);
      formData.append('caller_relationship', contextObj.caller_relationship);
      if (contextObj.notes) {
        formData.append('notes', contextObj.notes);
      }

      const response = await submitAnalysis(formData);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Error executing risk detection analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setActivePhase(3);
    setContext(preset.context);
    const blob = createSyntheticWavBlob(preset.id);
    let fileName = 'genuine_vendor_user.wav';
    if (preset.id === 'cloned_high_risk') {
      fileName = 'cloned_cfo_synthetic_sample.wav';
    } else if (preset.id === 'suspicious_context') {
      fileName = 'suspicious_call_sample.wav';
    }
    const demoFile = new File([blob], fileName, { type: 'audio/wav' });
    setCurrentFile(demoFile);
    runDetectionWithParams(demoFile, preset.context);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentFile) {
      setError('Please record or upload a current call audio file before running detection.');
      return;
    }
    runDetectionWithParams(currentFile, context);
  };

  return (
    <div className="relative min-h-screen bg-[#050508] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* 3D WebGL Canvas Layer */}
      <CosmicCanvas phase={activePhase} />

      {/* Floating Navbar Header */}
      <Navbar activePhase={activePhase} setActivePhase={setActivePhase} health={health} />

      {/* Dynamic Content Views */}
      <div className="relative z-20">
        {/* Phase 1: Resonant Orb Hero */}
        {activePhase === 1 && (
          <HeroSection
            onInitialize={() => setActivePhase(2)}
            onExploreDashboard={() => setActivePhase(3)}
          />
        )}

        {/* Phase 2: Neural Morph & Telemetry */}
        {activePhase === 2 && (
          <NeuralTelemetrySection
            onProceedDashboard={() => setActivePhase(3)}
            onEnterDashboard={() => setActivePhase(3)}
          />
        )}

        {/* Phase 3: Operational Risk Dashboard */}
        {activePhase === 3 && (
          <main className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12 space-y-12 animate-fade-in">
            {/* Dashboard Header Metadata Panel */}
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#080812]/95 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-8 shadow-[0_0_60px_rgba(0,240,255,0.08)]">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  <Radio className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk'] tracking-wide">
                      OPERATIONAL IMPERSONATION RADAR
                    </h2>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                      SESSION #SR-9982-X
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-mono tracking-wider mt-1">
                    REAL-TIME BIOMETRIC SPECTRUM & MULTIMODAL CONTEXTUAL IMPERSONATION ANALYZER
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="px-5 py-2.5 rounded-2xl bg-[#0d0e1c] border border-white/10 font-mono text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  LATENCY: <span className="text-cyan-300 font-bold">14ms</span>
                </div>
                <div className="px-5 py-2.5 rounded-2xl bg-[#0d0e1c] border border-white/10 font-mono text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  AES-256 <span className="text-emerald-400 font-bold">ENCRYPTED</span>
                </div>
                <div className="px-5 py-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 font-mono text-xs sm:text-sm text-cyan-300 flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                  STREAM: <span className="font-bold">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Real-time Audio Spectrum & Visualizer Component */}
            <AudioVisualizer audioFile={currentFile} isAnalyzing={loading} />

            {/* Presets Scenario Matrix */}
            <DemoPresetLoader onSelectPreset={handleSelectPreset} />

            {/* Live Upload & Context Risk Form */}
            <form onSubmit={handleSubmit} className="space-y-12">
              <AudioUpload
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                referenceFile={referenceFile}
                setReferenceFile={setReferenceFile}
              />

              <ContextForm context={context} setContext={setContext} />

              {error && (
                <div className="p-6 rounded-3xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-base font-bold flex items-center gap-4 shadow-[0_0_35px_rgba(244,63,94,0.3)] font-mono">
                  <ShieldAlert className="w-7 h-7 text-rose-400 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading || !currentFile}
                  className={`w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 rounded-full font-black text-lg sm:text-xl font-['Space_Grotesk'] tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-[0_0_40px_rgba(0,240,255,0.4)] ${
                    loading || !currentFile
                      ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-white/10'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white hover:shadow-[0_0_60px_rgba(0,240,255,0.8)] hover:scale-105 active:scale-95'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-7 h-7 animate-spin text-cyan-200" />
                      ANALYZING BIOMETRIC FREQUENCY VECTOR...
                    </>
                  ) : (
                    <>
                      <Activity className="w-7 h-7 text-cyan-200" />
                      EXECUTE SWARRAKSHAK RISK ENGINE
                      <ArrowRight className="w-7 h-7" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Risk Detection Output Result */}
            {result && <ResultCard result={result} />}
          </main>
        )}

        {/* Phase 4: Analyst History & Info Overview */}
        {activePhase === 4 && (
          <main className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12 space-y-12 animate-fade-in">
            <AnalystPortal />
            <InfoOverview />
          </main>
        )}
      </div>
    </div>
  );
}


