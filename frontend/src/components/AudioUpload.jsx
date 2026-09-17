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
      <div className="glass-panel-wine p-8 sm:p-10 rounded-3xl space-y-8 border border-[#FFF7E1]/15 bg-[#2C0F12]/95 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#FFF7E1]/10">
          <div>
            <h3 className="text-2xl font-black text-[#FFF7E1] flex items-center gap-3 font-['Space_Grotesk'] tracking-wide">
              <FileAudio className="w-7 h-7 text-[#FFF7E1]" />
              1. CURRENT CALL AUDIO SAMPLE
              <span className="text-xs font-mono font-bold text-[#FFF7E1] bg-[#790C12] px-3.5 py-1.5 rounded-full border border-[#FFF7E1]/30 uppercase tracking-widest shadow-lg">
                REQUIRED FOR ANALYSIS
              </span>
            </h3>
            <p className="text-sm text-[#FFF7E1]/80 font-mono tracking-wider mt-2 uppercase">
              UPLOAD AUDIO RECORDING OR RECORD LIVE SPEECH VIA BROWSER MICROPHONE (WAV, MP3, M4A UP TO 25MB)
            </p>
          </div>

          <div>
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#790C12] hover:bg-[#6B1E23] text-[#FFF7E1] font-mono font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 border border-[#FFF7E1]/20 cursor-pointer"
              >
                <Mic className="w-5 h-5 text-[#FFF7E1] animate-pulse" />
                Record Microphone Stream
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#6B1E23] text-[#FFF7E1] font-mono font-black text-sm uppercase tracking-wider animate-pulse shadow-xl border border-[#790C12] cursor-pointer"
              >
                <Square className="w-5 h-5 fill-current" />
                Stop Recording ({recordingTime}s)
              </button>
            )}
          </div>
        </div>

        <div className="border-2 border-dashed border-[#790C12] hover:border-[#FFF7E1] rounded-3xl p-10 sm:p-14 text-center transition-all duration-300 bg-[#6B1E23]/20 hover:bg-[#6B1E23]/40 group cursor-pointer shadow-inner">
          <input
            type="file"
            accept="audio/*,.wav,.mp3,.m4a"
            onChange={(e) => setCurrentFile(e.target.files[0] || null)}
            className="hidden"
            id="current-audio-input"
          />
          <label htmlFor="current-audio-input" className="cursor-pointer block space-y-4">
            <Upload className="w-14 h-14 text-[#FFF7E1] mx-auto group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_15px_rgba(121,12,18,0.8)]" />
            {currentFile ? (
              <div className="p-6 rounded-2xl bg-[#6B1E23] border border-[#790C12] max-w-lg mx-auto shadow-xl">
                <div className="flex items-center justify-center gap-3 text-[#FFF7E1] font-black text-base font-mono">
                  <CheckCircle2 className="w-6 h-6 text-[#FFF7E1]" />
                  <span>{currentFile.name}</span>
                </div>
                <p className="text-xs font-mono text-[#FFF7E1]/80 mt-2 uppercase">
                  SAMPLE LOADED • READY FOR ANALYSIS ({(currentFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-black text-[#FFF7E1] group-hover:text-[#FFF7E1] transition-colors font-['Space_Grotesk'] tracking-wide">
                  CLICK TO CHOOSE AUDIO RECORDING FILE OR DRAG & DROP HERE
                </p>
                <p className="text-xs text-[#FFF7E1]/70 font-mono tracking-wider mt-2 uppercase">
                  SUPPORTED AUDIO FORMATS: WAV, MP3, M4A, FLAC, OGG
                </p>
              </div>
            )}
          </label>

          {currentFile && (
            <div className="mt-8 pt-6 border-t border-[#FFF7E1]/10 flex justify-center">
              <audio controls src={URL.createObjectURL(currentFile)} className="h-12 w-full max-w-xl rounded-2xl shadow-lg border border-[#790C12]" />
            </div>
          )}
        </div>
      </div>

      {/* Optional Reference Voice Audio Container */}
      <div className="glass-panel-wine p-8 sm:p-10 rounded-3xl space-y-6 border border-[#FFF7E1]/15 bg-[#2C0F12]/95 backdrop-blur-2xl shadow-2xl">
        <div className="pb-4 border-b border-[#FFF7E1]/10">
          <h3 className="text-2xl font-black text-[#FFF7E1] flex items-center gap-3 font-['Space_Grotesk'] tracking-wide">
            <Music className="w-7 h-7 text-[#FFF7E1]" />
            2. TRUSTED REFERENCE VOICE SAMPLE
            <span className="text-xs font-mono font-bold text-[#FFF7E1] bg-[#6B1E23] px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-[#790C12]">
              OPTIONAL COMPARISON
            </span>
          </h3>
          <p className="text-sm text-[#FFF7E1]/80 font-mono tracking-wider mt-2 uppercase">
            UPLOAD CONSENTED REFERENCE AUDIO OF CLAIMED IDENTITY (E.G. EXECUTIVE VOICEPRINT) FOR SPEAKER COMPARISON
          </p>
        </div>

        <div className="border-2 border-dashed border-[#FFF7E1]/20 hover:border-[#FFF7E1] rounded-3xl p-8 text-center transition-all duration-300 bg-[#6B1E23]/20 hover:bg-[#6B1E23]/40 cursor-pointer">
          <input
            type="file"
            accept="audio/*,.wav,.mp3,.m4a"
            onChange={(e) => setReferenceFile(e.target.files[0] || null)}
            className="hidden"
            id="ref-audio-input"
          />
          <label htmlFor="ref-audio-input" className="cursor-pointer block">
            {referenceFile ? (
              <div className="p-4 rounded-2xl bg-[#6B1E23] border border-[#790C12] max-w-lg mx-auto flex items-center justify-center gap-3 text-[#FFF7E1] font-black text-base font-mono">
                <CheckCircle2 className="w-6 h-6 text-[#FFF7E1]" />
                <span>{referenceFile.name} ({(referenceFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-[#FFF7E1] hover:text-[#FFF7E1] font-bold text-base font-mono transition-colors uppercase">
                <Sparkles className="w-5 h-5 text-[#FFF7E1]" />
                <span>+ CLICK TO UPLOAD OPTIONAL REFERENCE VOICE PRINT SAMPLE</span>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}


