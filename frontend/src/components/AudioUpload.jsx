import React, { useState, useRef } from 'react';
import { Upload, Mic, Square, CheckCircle2, FileAudio, Music } from 'lucide-react';

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
    <div className="space-y-8 my-6">
      {/* Current Call Audio Container */}
      <div className="glass-panel p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <FileAudio className="w-6 h-6 text-cyan-400" />
              1. Current Call Audio Sample
              <span className="text-xs font-bold text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30 uppercase tracking-wider">
                Required
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload current call recording or record live speech via browser mic (WAV, MP3, M4A up to 25MB & max 60s).
            </p>
          </div>

          <div>
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 hover:opacity-90 active:scale-95 transition"
              >
                <Mic className="w-4 h-4 text-white animate-pulse" />
                Record Live Microphone
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs animate-bounce shadow-xl shadow-rose-600/40"
              >
                <Square className="w-4 h-4 fill-white" />
                Stop Recording ({recordingTime}s)
              </button>
            )}
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500 rounded-2xl p-8 text-center transition bg-slate-900/50 hover:bg-slate-900/80 group">
          <input
            type="file"
            accept="audio/*,.wav,.mp3,.m4a"
            onChange={(e) => setCurrentFile(e.target.files[0] || null)}
            className="hidden"
            id="current-audio-input"
          />
          <label htmlFor="current-audio-input" className="cursor-pointer block space-y-3">
            <Upload className="w-10 h-10 text-cyan-400 mx-auto opacity-80 group-hover:scale-110 group-hover:opacity-100 transition" />
            {currentFile ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{currentFile.name}</span>
                </div>
                <p className="text-xs text-emerald-300/70 mt-1">
                  Ready for analysis ({(currentFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div>
                <p className="text-base font-bold text-slate-200 group-hover:text-cyan-300 transition">
                  Click to select audio file or drag & drop here
                </p>
                <p className="text-xs text-slate-400 mt-1">Supported audio formats: WAV, MP3, M4A</p>
              </div>
            )}
          </label>

          {currentFile && (
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-center">
              <audio controls src={URL.createObjectURL(currentFile)} className="h-10 max-w-full rounded-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Optional Reference Voice Audio Container */}
      <div className="glass-panel p-8 space-y-4">
        <div className="pb-4 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Music className="w-6 h-6 text-indigo-400" />
            2. Trusted Reference Voice Sample
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
              Optional
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Provide a consented reference recording of the claimed identity (e.g. CFO voice sample) for speaker verification comparison.
          </p>
        </div>

        <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl p-6 text-center transition bg-slate-900/30">
          <input
            type="file"
            accept="audio/*,.wav,.mp3,.m4a"
            onChange={(e) => setReferenceFile(e.target.files[0] || null)}
            className="hidden"
            id="ref-audio-input"
          />
          <label htmlFor="ref-audio-input" className="cursor-pointer block">
            {referenceFile ? (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 max-w-md mx-auto flex items-center justify-center gap-2 text-indigo-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                <span>{referenceFile.name} ({(referenceFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-400 hover:text-indigo-300 transition">
                + Click to upload optional reference voice sample
              </p>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
