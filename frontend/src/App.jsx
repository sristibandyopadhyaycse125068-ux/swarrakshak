import React, { useState, useEffect } from 'react';
import LoadingPage from './components/LoadingPage';
import CrimsonGlobeViewport from './components/3d/CrimsonGlobeViewport';
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
import BentoRiskDashboard from './components/BentoRiskDashboard';
import TelemetryIngestModal from './components/TelemetryIngestModal';
import { checkHealth, submitAnalysis } from './services/api';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('topology'); // topology | dashboard | analyst | overview
  const [health, setHealth] = useState(null);
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);

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
      if (presetType === 'cloned_high_risk' || presetType === 'B') {
        const voice = Math.sin(2 * Math.PI * 160 * t);
        const noise = (Math.random() * 2 - 1) * 0.45;
        sample = (voice * 0.5 + noise) * 12000;
      } else if (presetType === 'suspicious_context' || presetType === 'C') {
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
      formData.append('caller_number_status', contextObj.caller_number_status || 'known');
      formData.append('request_urgency', contextObj.request_urgency || 'normal');
      formData.append('transaction_value', contextObj.transaction_value || 'low');
      formData.append('procedure_status', contextObj.procedure_status || 'normal');
      formData.append('caller_relationship', contextObj.caller_relationship || 'customer');
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

  const handleRunEngineFromModal = (payload) => {
    setActiveTab('dashboard');

    // If direct metrics object received from TelemetryIngestModal
    if (payload && payload.overallScore !== undefined) {
      const mockResult = {
        risk_score: payload.overallScore,
        risk_level: payload.overallScore >= 70 ? 'high' : (payload.overallScore >= 40 ? 'medium' : 'low'),
        speaker_analysis: { similarity: payload.voiceMatchPct / 100 },
        audio_analysis: { synthetic_probability: (100 - payload.acousticIntegrityPct) / 100 },
        reasons: [
          { message: payload.decisionText }
        ]
      };
      setResult(mockResult);
      return;
    }

    const { scenario, customFile, referenceFile: refFile, context: ctxObj } = payload || {};

    if (scenario) {
      const presetId = scenario === 'A' ? 'genuine' : (scenario === 'B' ? 'cloned_high_risk' : 'suspicious_context');
      const presetContext = scenario === 'A'
        ? { caller_number_status: 'known', request_urgency: 'normal', transaction_value: 'low', procedure_status: 'normal', caller_relationship: 'executive' }
        : (scenario === 'B'
          ? { caller_number_status: 'hidden', request_urgency: 'urgent', transaction_value: 'high', procedure_status: 'bypass_requested', caller_relationship: 'executive' }
          : { caller_number_status: 'unknown', request_urgency: 'time_sensitive', transaction_value: 'medium', procedure_status: 'bypass_requested', caller_relationship: 'vendor' });

      setContext(presetContext);
      const blob = createSyntheticWavBlob(scenario);
      const demoFile = new File([blob], `sample_scenario_${scenario.toLowerCase()}.wav`, { type: 'audio/wav' });
      setCurrentFile(demoFile);
      runDetectionWithParams(demoFile, presetContext);
    } else {
      if (customFile) setCurrentFile(customFile);
      if (refFile) setReferenceFile(refFile);
      if (ctxObj) {
        const mappedContext = {
          caller_number_status: ctxObj.callerId === 'Impersonation suspected' ? 'hidden' : (ctxObj.callerId === 'Unknown caller' ? 'unknown' : 'known'),
          request_urgency: ctxObj.urgency === 'Urgent' || ctxObj.urgency === 'Critical' ? 'urgent' : 'normal',
          transaction_value: ctxObj.transactionValue === 'High value' || ctxObj.transactionValue === 'Critical value' ? 'high' : 'low',
          procedure_status: ctxObj.override === 'Requested override' || ctxObj.override === 'Full override' ? 'bypass_requested' : 'normal',
          caller_relationship: (ctxObj.claimedRole || 'customer').toLowerCase()
        };
        setContext(mappedContext);
        if (customFile) {
          runDetectionWithParams(customFile, mappedContext);
        }
      }
    }
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
    <div className="relative min-h-screen bg-[#050203] text-white selection:bg-[#6B1E23] selection:text-white overflow-x-hidden font-sans">
      {/* 1. Loading Page Transition */}
      {isLoading && (
        <LoadingPage onComplete={() => setIsLoading(false)} />
      )}

      {/* 2. Interactive 3D Geodesic Crimson Globe Viewport */}
      {!isLoading && activeTab === 'topology' && (
        <CrimsonGlobeViewport />
      )}

      {/* 3. Modern Glassmorphic Top Navigation Header */}
      {!isLoading && (
        <>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* PHYSICAL NAVBAR CLEARANCE SPACER - DO NOT REMOVE */}
          <div style={{ height: '88px', width: '100%', flexShrink: 0, display: 'block' }} aria-hidden="true" />
        </>
      )}

      {/* TELEMETRY INGEST LIQUID GLASS DIALOG MODAL */}
      <TelemetryIngestModal
        isOpen={isTelemetryModalOpen}
        onClose={() => setIsTelemetryModalOpen(false)}
        onRunEngine={handleRunEngineFromModal}
      />

      {/* 4. Main Section Views */}
      {!isLoading && (
        <div className="relative z-10">

          
          {/* VIEW 1: TOPOLOGY PAGE (Spatial Hero + 3D Horizon) */}
          {activeTab === 'topology' && (
            <div className="animate-fadeIn">
              <HeroSection
                onOpenDashboard={() => setIsTelemetryModalOpen(true)}
              />
            </div>
          )}


          {/* VIEW 2: DEDICATED BENTO RISK DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="animate-fadeIn">
              <BentoRiskDashboard
                setActiveTab={setActiveTab}
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                referenceFile={referenceFile}
                setReferenceFile={setReferenceFile}
                context={context}
                setContext={setContext}
                loading={loading}
                error={error}
                result={result}
                handleSubmit={handleSubmit}
                handleSelectPreset={handleSelectPreset}
              />
            </div>
          )}

          {/* VIEW 3: ANALYST HISTORY */}
          {activeTab === 'analyst' && (
            <div className="animate-fadeIn">
              <AnalystPortal />
            </div>
          )}

          {/* VIEW 4: OVERVIEW PREVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <InfoOverview />
            </div>
          )}
        </div>
      )}
    </div>
  );
}






