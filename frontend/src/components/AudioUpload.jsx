import React, { useState, useRef, useEffect } from 'react';

export const inferContextFromAudio = (fileOrMetadata) => {
  const fileName = String(fileOrMetadata?.name || '').toLowerCase();

  // Heuristic matching based on filename, mock NLP transcript, or detected telemetry
  const isDeliveryOrEcom = fileName.includes('flipkart') || fileName.includes('amazon') || fileName.includes('delivery') || fileName.includes('order');
  const isFinanceOrOtp = fileName.includes('bank') || fileName.includes('wire') || fileName.includes('transfer') || fileName.includes('otp') || fileName.includes('urgent');
  const isDeepfakeTest = fileName.includes('spoof') || fileName.includes('fake') || fileName.includes('clone') || fileName.includes('synthetic');

  if (isDeliveryOrEcom) {
    return {
      caller_number_status: 'unknown',
      request_urgency: 'time_sensitive',
      transaction_value: 'low',
      procedure_status: 'bypass_requested',
      caller_relationship: 'vendor',
      notes: 'Automated E-Commerce / Delivery Dispatch Call'
    };
  }

  if (isFinanceOrOtp || isDeepfakeTest) {
    return {
      caller_number_status: 'hidden',
      request_urgency: 'urgent',
      transaction_value: 'high',
      procedure_status: 'bypass_requested',
      caller_relationship: 'executive',
      notes: 'High Urgency Wire / Executive Impersonation'
    };
  }

  // General unknown audio upload defaults to moderate inquiry analysis
  return {
    caller_number_status: 'unknown',
    request_urgency: 'normal',
    transaction_value: 'low',
    procedure_status: 'normal',
    caller_relationship: 'customer',
    notes: 'Standard External Voice Stream'
  };
};

export default function AudioUpload({ currentFile, setCurrentFile, referenceFile, setReferenceFile, setContext, runDetectionWithParams }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const [dragActiveCurrent, setDragActiveCurrent] = useState(false);
  const [dragActiveRef, setDragActiveRef] = useState(false);

  // Custom Audio Player State for Current Sample
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);
  const [currentAudioProgress, setCurrentAudioProgress] = useState(0);
  const [currentDuration, setCurrentDuration] = useState('00:00');
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('00:00');
  const currentAudioRef = useRef(null);

  const [currentFileName, setCurrentFileName] = useState('');
  const [currentFileSize, setCurrentFileSize] = useState('');

  const processInferredAudioFile = (file) => {
    setCurrentFile(file);
    if (setContext) {
      const inferred = inferContextFromAudio(file);
      setContext(inferred);
      if (runDetectionWithParams) {
        runDetectionWithParams(file, inferred);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], `mic_recording_${Date.now()}.wav`, { type: 'audio/wav' });
        processInferredAudioFile(file);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied or unavailable in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (!currentFile) {
      if (currentAudioUrl && currentAudioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentAudioUrl);
      }
      setCurrentAudioUrl(null);
      setCurrentFileName('');
      setCurrentFileSize('');
      setIsPlayingCurrent(false);
      setCurrentAudioProgress(0);
      setCurrentDuration('00:00');
      setCurrentTimeDisplay('00:00');
      return;
    }

    const url = URL.createObjectURL(currentFile);
    setCurrentAudioUrl(url);
    setCurrentFileName(currentFile.name || 'FAKE_AUDIO_PHONE.wav');
    setCurrentFileSize(currentFile.size ? (currentFile.size / (1024 * 1024)).toFixed(2) + ' MB' : '0.12 MB');
    setIsPlayingCurrent(false);
    setCurrentAudioProgress(0);

    return () => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [currentFile]);

  const handleCurrentFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (currentAudioUrl && currentAudioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentAudioUrl);
    }

    const url = URL.createObjectURL(file);
    setCurrentAudioUrl(url);
    setCurrentFileName(file.name);
    setCurrentFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
    processInferredAudioFile(file);
    setIsPlayingCurrent(false);
    setCurrentAudioProgress(0);
  };

  const togglePlayCurrent = () => {
    if (!currentAudioRef.current || !currentAudioUrl) {
      console.warn("No audio source available to play.");
      return;
    }
    if (isPlayingCurrent) {
      currentAudioRef.current.pause();
      setIsPlayingCurrent(false);
    } else {
      currentAudioRef.current.play()
        .then(() => setIsPlayingCurrent(true))
        .catch((err) => console.error("Audio playback error:", err));
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDragCurrent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveCurrent(true);
    } else if (e.type === 'dragleave') {
      setDragActiveCurrent(false);
    }
  };

  const handleDropCurrent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveCurrent(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setCurrentAudioUrl(url);
      setCurrentFileName(file.name);
      setCurrentFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
      processInferredAudioFile(file);
    }
  };

  const handleDragRef = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveRef(true);
    } else if (e.type === 'dragleave') {
      setDragActiveRef(false);
    }
  };

  const handleDropRef = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveRef(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReferenceFile(e.dataTransfer.files[0]);
    }
  };

  const handleReferenceUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ marginTop: '32px', marginBottom: '32px', width: '100%', display: 'flex', flexDirection: 'column', gap: '28px', boxSizing: 'border-box' }}>
      {/* 1. CURRENT CALL AUDIO SAMPLE (REQUIRED) */}
      <div className="glass-panel" style={{
        borderRadius: '18px',
        padding: '30px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Card Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#E11D48', fontSize: '18px' }}>🎧</span>
              <h3 style={{
                fontFamily: "'Syncopate', sans-serif",
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.12em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                margin: 0
              }}>
                CURRENT CALL AUDIO SAMPLE
              </h3>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '10px',
                fontWeight: '700',
                color: '#E11D48',
                backgroundColor: 'rgba(225, 29, 72, 0.15)',
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.06em'
              }}>
                REQUIRED
              </span>
            </div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px',
              color: '#a1a1aa',
              margin: '6px 0 0 0'
            }}>
              Upload the audio sample that should be analyzed for impersonation, tampering, and synthesis indicators.
            </p>
          </div>

          <button
            type="button"
            onClick={!isRecording ? startRecording : stopRecording}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isRecording ? 'rgba(225, 29, 72, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 14px',
              borderRadius: '8px',
              color: '#f43f5e',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🎙️ {isRecording ? `Stop (${recordingTime}s)` : 'Record Microphone'}
          </button>
        </div>

        {/* Centered Upload Dropzone or Loaded State */}
        {!currentFile && !currentAudioUrl ? (
          <div
            onDragEnter={handleDragCurrent}
            onDragLeave={handleDragCurrent}
            onDragOver={handleDragCurrent}
            onDrop={handleDropCurrent}
            style={{
              border: '1px dashed rgba(255, 255, 255, 0.16)',
              borderRadius: '14px',
              backgroundColor: dragActiveCurrent ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              padding: 'clamp(20px, 4vw, 40px) 16px',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              color: '#FFFFFF',
              fontSize: '18px'
            }}>
              ⬆
            </div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '17px',
              fontWeight: '700',
              color: '#FFFFFF',
              margin: '0 0 6px 0'
            }}>
              Add files to upload or browse
            </h4>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              color: '#71717a',
              margin: '0 0 16px 0'
            }}>
              Supported formats: WAV, MP3, M4A, FLAC (Up to 25MB)
            </p>
            <label style={{
              backgroundColor: '#9F1239',
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px',
              fontWeight: '700',
              padding: '10px 22px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-block'
            }}>
              Select files
              <input type="file" accept="audio/*" onChange={handleCurrentFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: '#111116',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '18px 24px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Top Meta Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  fontSize: '16px'
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: '700', color: '#FFFFFF' }}>
                    {currentFileName || currentFile?.name || 'FAKE_AUDIO_PHONE.wav'}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#a1a1aa', marginTop: '2px' }}>
                    {currentFileSize || (currentFile?.size ? (currentFile.size / (1024 * 1024)).toFixed(2) + ' MB' : '0.12 MB')} • Uploaded successfully
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  color: '#FFFFFF',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}>
                  Replace
                  <input type="file" accept="audio/*" onChange={handleCurrentFileUpload} style={{ display: 'none' }} />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (currentAudioUrl && currentAudioUrl.startsWith('blob:')) URL.revokeObjectURL(currentAudioUrl);
                    setCurrentAudioUrl(null);
                    setCurrentFileName('');
                    setCurrentFile(null);
                    setIsPlayingCurrent(false);
                  }}
                  style={{
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    color: '#f43f5e',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Hidden Native Audio Element */}
            <audio
              ref={currentAudioRef}
              src={currentAudioUrl}
              onEnded={() => {
                setIsPlayingCurrent(false);
                setCurrentAudioProgress(0);
              }}
              onTimeUpdate={() => {
                if (currentAudioRef.current) {
                  const cur = currentAudioRef.current.currentTime;
                  const dur = currentAudioRef.current.duration || 1;
                  setCurrentAudioProgress((cur / dur) * 100);
                  setCurrentTimeDisplay(formatTime(cur));
                }
              }}
              onLoadedMetadata={() => {
                if (currentAudioRef.current) {
                  setCurrentDuration(formatTime(currentAudioRef.current.duration));
                }
              }}
            />

            {/* Custom High-Contrast Dark Audio Player Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '10px 18px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <button
                type="button"
                onClick={togglePlayCurrent}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#E11D48',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '14px',
                  flexShrink: 0
                }}
              >
                {isPlayingCurrent ? '❚❚' : '▶'}
              </button>

              <div
                onClick={(e) => {
                  if (!currentAudioRef.current || !currentAudioRef.current.duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = clickX / rect.width;
                  currentAudioRef.current.currentTime = pct * currentAudioRef.current.duration;
                }}
                style={{
                  flex: 1,
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: `${currentAudioProgress}%`,
                  height: '100%',
                  backgroundColor: '#E11D48',
                  borderRadius: '3px',
                  transition: 'width 0.1s linear'
                }} />
              </div>

              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#a1a1aa', flexShrink: 0 }}>
                {currentTimeDisplay} / {currentDuration}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. TRUSTED REFERENCE VOICE SAMPLE (OPTIONAL) */}
      <div className="glass-panel" style={{
        borderRadius: '18px',
        padding: '30px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Card Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#f43f5e', fontSize: '18px' }}>🎵</span>
              <h3 style={{
                fontFamily: "'Syncopate', sans-serif",
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.12em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                margin: 0
              }}>
                TRUSTED REFERENCE VOICE SAMPLE
              </h3>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '10px',
                fontWeight: '700',
                color: '#a1a1aa',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.06em'
              }}>
                OPTIONAL
              </span>
            </div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px',
              color: '#a1a1aa',
              margin: '6px 0 0 0'
            }}>
              Upload a verified voice sample to improve biometric comparison accuracy.
            </p>
          </div>
        </div>

        {/* Centered Upload Dropzone or Loaded State */}
        {!referenceFile ? (
          <div
            onDragEnter={handleDragRef}
            onDragLeave={handleDragRef}
            onDragOver={handleDragRef}
            onDrop={handleDropRef}
            style={{
              border: '1px dashed rgba(255, 255, 255, 0.16)',
              borderRadius: '14px',
              backgroundColor: dragActiveRef ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              padding: 'clamp(20px, 4vw, 40px) 16px',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              color: '#FFFFFF',
              fontSize: '18px'
            }}>
              ✨
            </div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '17px',
              fontWeight: '700',
              color: '#FFFFFF',
              margin: '0 0 6px 0'
            }}>
              Add files to upload or browse
            </h4>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              color: '#71717a',
              margin: '0 0 16px 0'
            }}>
              Optional consented reference voice print sample
            </p>
            <label style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px',
              fontWeight: '700',
              padding: '10px 22px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-block'
            }}>
              Select files
              <input type="file" accept="audio/*" onChange={handleReferenceUpload} style={{ display: 'none' }} />
            </label>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#0D0D11',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
              <div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                  {referenceFile.name}
                </h4>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#a1a1aa', margin: '3px 0 0 0' }}>
                  {(referenceFile.size / (1024 * 1024)).toFixed(2)} MB • Reference loaded
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReferenceFile(null)}
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#f43f5e',
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
