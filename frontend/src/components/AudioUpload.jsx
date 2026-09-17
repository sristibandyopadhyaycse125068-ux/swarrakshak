import React, { useState, useRef } from 'react';
import { Upload, Mic, Square, CheckCircle2, FileAudio, Music, Sparkles } from 'lucide-react';

export default function AudioUpload({ currentFile, setCurrentFile, referenceFile, setReferenceFile }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

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
        setCurrentFile(file);
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

  return (
    <div className="space-y-10 my-8 relative z-20">
      {/* Current Call Audio Container */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-8 border border-cyan-500/30 bg-[#080812]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-3 font-['Space_Grotesk'] tracking-wide">
              <FileAudio className="w-7 h-7 text-cyan-400" />
              1. CURRENT CALL AUDIO SAMPLE
              <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 px-3.5 py-1.5 rounded-full border border-rose-500/40 uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                REQUIRED FOR ANALYSIS
              </span>
            </h3>
            <p className="text-sm text-slate-300 font-mono tracking-wider mt-2">
              UPLOAD AUDIO RECORDING OR RECORD LIVE SPEECH VIA BROWSER MICROPHONE (WAV, MP3, M4A UP TO 25MB)
            </p>
          </div>

          <div>
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Mic className="w-5 h-5 text-white animate-pulse" />
                Record Microphone Stream
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-600 text-white font-black text-sm uppercase tracking-wider animate-pulse shadow-[0_0_30px_rgba(225,29,72,0.6)] cursor-pointer"
              >
                <Square className="w-5 h-5 fill-white" />
                Stop Recording ({recordingTime}s)
              </button>
            )}
          </div>
        </div>

        <div className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-3xl p-10 sm:p-14 text-center transition-all duration-300 bg-[#0d0e1c]/80 hover:bg-[#101226] group cursor-pointer shadow-inner">
          <input
            type="file"
            accept="audio/*,.wav,.mp3,.m4a"
            onChange={(e) => setCurrentFile(e.target.files[0] || null)}
            className="hidden"
            id="current-audio-input"
          />
          <label htmlFor="current-audio-input" className="cursor-pointer block space-y-4">
            <Upload className="w-14 h-14 text-cyan-400 mx-auto group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
            {currentFile ? (
              <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 max-w-lg mx-auto shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <div className="flex items-center justify-center gap-3 text-emerald-300 font-black text-base font-mono">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>{currentFile.name}</span>
                </div>
                <p className="text-xs font-mono text-emerald-400/80 mt-2">
                  SAMPLE LOADED • READY FOR ANALYSIS ({(currentFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-black text-slate-100 group-hover:text-cyan-300 transition-colors font-['Space_Grotesk'] tracking-wide">
                  CLICK TO CHOOSE AUDIO RECORDING FILE OR DRAG & DROP HERE
                </p>
                <p className="text-xs text-slate-400 font-mono tracking-wider mt-2">
                  SUPPORTED AUDIO FORMATS: WAV, MP3, M4A, FLAC, OGG
                </p>
              </div>
            )}
          </label>

          {currentFile && (
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
              <audio controls src={URL.createObjectURL(currentFile)} className="h-12 w-full max-w-xl rounded-2xl shadow-lg border border-cyan-500/30" />
            </div>
          )}
        </div>
      </div>

      {/* Optional Reference Voice Audio Container */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 border border-indigo-500/30 bg-[#080812]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(123,44,191,0.08)]">
        <div className="pb-4 border-b border-white/10">
          <h3 className="text-2xl font-black text-white flex items-center gap-3 font-['Space_Grotesk'] tracking-wide">
            <Music className="w-7 h-7 text-indigo-400" />
            2. TRUSTED REFERENCE VOICE SAMPLE
            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-slate-700">
              OPTIONAL COMPARISON
            </span>
          </h3>
          <p className="text-sm text-slate-300 font-mono tracking-wider mt-2">
            UPLOAD CONSENTED REFERENCE AUDIO OF CLAIMED IDENTITY (E.G. EXECUTIVE VOICEPRINT) FOR SPEAKER COMPARISON
          </p>
        </div>

        <div className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-400 rounded-3xl p-8 text-center transition-all duration-300 bg-[#0d0e1c]/60 hover:bg-[#101226] cursor-pointer">
          <input
            type="file"
            accept="audio/*,.wav,.mp3,.m4a"
            onChange={(e) => setReferenceFile(e.target.files[0] || null)}
            className="hidden"
            id="ref-audio-input"
          />
          <label htmlFor="ref-audio-input" className="cursor-pointer block">
            {referenceFile ? (
              <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/50 max-w-lg mx-auto flex items-center justify-center gap-3 text-indigo-300 font-black text-base font-mono">
                <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                <span>{referenceFile.name} ({(referenceFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-slate-300 hover:text-indigo-300 font-bold text-base font-mono transition-colors">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>+ CLICK TO UPLOAD OPTIONAL REFERENCE VOICE PRINT SAMPLE</span>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}

