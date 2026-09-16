import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AudioUpload from './components/AudioUpload';
import ContextForm from './components/ContextForm';
import ResultCard from './components/ResultCard';
import DemoPresetLoader from './components/DemoPresetLoader';
import AnalystPortal from './components/AnalystPortal';
import InfoOverview from './components/InfoOverview';
import { checkHealth, submitAnalysis } from './services/api';
import { ShieldCheck, Loader2, ArrowRight, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('new');
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
        // High risk vocoder phase noise & digital synthesis artifacts
        const voice = Math.sin(2 * Math.PI * 160 * t);
        const noise = (Math.random() * 2 - 1) * 0.45;
        sample = (voice * 0.5 + noise) * 12000;
      } else if (presetType === 'suspicious_context') {
        // Medium risk slightly degraded / altered voice signal
        const voice = Math.sin(2 * Math.PI * 180 * t) + 0.3 * Math.sin(2 * Math.PI * 360 * t);
        const noise = (Math.random() * 2 - 1) * 0.15;
        sample = (voice * 0.7 + noise) * 10000;
      } else {
        // Organic natural human speech harmonics
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
    // Auto-trigger detection with distinct preset audio & context
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
    <div className="min-h-screen pb-24 px-4 sm:px-6 lg:px-8">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} health={health} />

      <main className="max-w-6xl mx-auto space-y-10">
        {activeTab === 'new' && (
          <div className="space-y-10">
            <DemoPresetLoader onSelectPreset={handleSelectPreset} />

            <form onSubmit={handleSubmit} className="space-y-10">
              <AudioUpload
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                referenceFile={referenceFile}
                setReferenceFile={setReferenceFile}
              />

              <ContextForm context={context} setContext={setContext} />

              {error && (
                <div className="p-5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold flex items-center gap-3 shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-rose-400 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading || !currentFile}
                  className={`w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-2xl ${
                    loading || !currentFile
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:opacity-95 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 shadow-cyan-500/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-cyan-200" />
                      Analyzing Audio Signal & Context...
                    </>
                  ) : (
                    <>
                      <Activity className="w-6 h-6 text-cyan-200" />
                      Run Voice Impersonation Risk Engine
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {result && <ResultCard result={result} />}
          </div>
        )}

        {activeTab === 'analyst' && <AnalystPortal />}

        {activeTab === 'info' && <InfoOverview />}
      </main>
    </div>
  );
}
