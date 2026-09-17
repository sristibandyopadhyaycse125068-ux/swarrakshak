import React, { useState, useEffect } from 'react';
import LoadingPage from './components/LoadingPage';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TopologyVisualization from './components/TopologyVisualization';
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('topology'); // topology | dashboard | analyst | overview
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
    setActiveTab('dashboard');
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
    <div className="relative min-h-screen bg-[#2C0F12] text-[#FFF7E1] selection:bg-[#790C12] selection:text-[#FFF7E1] overflow-x-hidden font-sans">
      {/* 1. Full-screen Loading Page Transition */}
      {isLoading && (
        <LoadingPage onComplete={() => setIsLoading(false)} />
      )}

      {/* Background Neural Grid Accent Layer */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#790C12_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* 2. Glassmorphic Navigation Bar */}
      {!isLoading && (
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} health={health} />
      )}

      {/* 3. Main Views Router */}
      {!isLoading && (
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 py-8 space-y-12">
          {/* VIEW 1: TOPOLOGY PAGE (Hero + Neural Topology Visualization) */}
          {activeTab === 'topology' && (
            <div className="space-y-12 animate-fadeIn">
              <HeroSection
                onOpenDashboard={() => setActiveTab('dashboard')}
                onOpenTopology={() => {
                  const el = document.getElementById('topology-map-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              <div id="topology-map-section">
                <TopologyVisualization onOpenRiskEngine={() => setActiveTab('dashboard')} />
              </div>
            </div>
          )}

          {/* VIEW 2: RISK DASHBOARD (Operational Voice Impersonation Radar) */}
          {activeTab === 'dashboard' && (
            <main className="space-y-12 animate-fadeIn">
              {/* Dashboard Header Metadata Panel */}
              <div className="glass-panel-wine p-8 rounded-3xl border border-[#FFF7E1]/15 bg-[#2C0F12]/90 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-8 shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-[#6B1E23] border border-[#790C12] text-[#FFF7E1]">
                    <Radio className="w-8 h-8 animate-pulse text-[#FFF7E1]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-black text-[#FFF7E1] font-['Space_Grotesk'] tracking-wide uppercase">
                        OPERATIONAL IMPERSONATION RADAR
                      </h2>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#6B1E23] text-[#FFF7E1] border border-[#790C12]">
                        SESSION #SR-9982-X
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#FFF7E1]/80 font-mono tracking-wider mt-1 uppercase">
                      REAL-TIME BIOMETRIC SPECTRUM & MULTIMODAL IMPERSONATION ENGINE
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="px-5 py-2.5 rounded-2xl bg-[#2C0F12] border border-[#FFF7E1]/15 font-mono text-xs sm:text-sm text-[#FFF7E1] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FFF7E1]" />
                    LATENCY: <span className="font-bold">14ms</span>
                  </div>
                  <div className="px-5 py-2.5 rounded-2xl bg-[#2C0F12] border border-[#FFF7E1]/15 font-mono text-xs sm:text-sm text-[#FFF7E1] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#FFF7E1]" />
                    AES-256 <span className="font-bold">ENCRYPTED</span>
                  </div>
                  <div className="px-5 py-2.5 rounded-2xl bg-[#6B1E23] border border-[#790C12] font-mono text-xs sm:text-sm text-[#FFF7E1] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FFF7E1] animate-pulse" />
                    STREAM: <span className="font-bold">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Real-time Audio Spectrum & Visualizer Component */}
              <AudioVisualizer audioFile={currentFile} isAnalyzing={loading} />

              {/* Scenario Matrix Presets */}
              <DemoPresetLoader onSelectPreset={handleSelectPreset} />

              {/* Audio Upload & Context Risk Form */}
              <form onSubmit={handleSubmit} className="space-y-12">
                <AudioUpload
                  currentFile={currentFile}
                  setCurrentFile={setCurrentFile}
                  referenceFile={referenceFile}
                  setReferenceFile={setReferenceFile}
                />

                <ContextForm context={context} setContext={setContext} />

                {error && (
                  <div className="p-6 rounded-3xl bg-[#790C12] border border-[#FFF7E1]/30 text-[#FFF7E1] text-base font-bold flex items-center gap-4 shadow-2xl font-mono">
                    <ShieldAlert className="w-7 h-7 text-[#FFF7E1] shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading || !currentFile}
                    className={`w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 rounded-full font-black text-lg sm:text-xl font-['Space_Grotesk'] tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-2xl ${
                      loading || !currentFile
                        ? 'bg-[#2C0F12] text-[#FFF7E1]/40 cursor-not-allowed border border-[#FFF7E1]/10'
                        : 'bg-[#790C12] hover:bg-[#6B1E23] text-[#FFF7E1] border border-[#FFF7E1]/20 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(121,12,18,0.7)]'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-7 h-7 animate-spin text-[#FFF7E1]" />
                        ANALYZING BIOMETRIC FREQUENCY VECTOR...
                      </>
                    ) : (
                      <>
                        <Activity className="w-7 h-7 text-[#FFF7E1]" />
                        EXECUTE SWARRAKSHAK RISK ENGINE
                        <ArrowRight className="w-7 h-7" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Risk Engine Results Card */}
              {result && <ResultCard result={result} />}
            </main>
          )}

          {/* VIEW 3: ANALYST HISTORY */}
          {activeTab === 'analyst' && (
            <main className="animate-fadeIn">
              <AnalystPortal />
            </main>
          )}

          {/* VIEW 4: OVERVIEW PREVIEW */}
          {activeTab === 'overview' && (
            <main className="animate-fadeIn">
              <InfoOverview />
            </main>
          )}
        </div>
      )}
    </div>
  );
}



