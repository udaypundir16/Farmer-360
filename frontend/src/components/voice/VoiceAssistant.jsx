import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendVoiceMessage } from '../../services/ai.service';

const TARGET_SAMPLE_RATE = 16000; // 16 kHz mono is ideal for speech APIs

/** Resample and mix to mono, then encode to 16-bit PCM WAV for Sarvam STT */
function audioBufferToWavBlob(buffer) {
  const sampleRate = buffer.sampleRate;
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length;
  // Resample to TARGET_SAMPLE_RATE if needed and mix to mono
  const outLength = Math.round((length * TARGET_SAMPLE_RATE) / sampleRate);
  const mono = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIndex = (i * sampleRate) / TARGET_SAMPLE_RATE;
    const srcIdx = Math.min(Math.floor(srcIndex), length - 1);
    let s = 0;
    for (let c = 0; c < numChannels; c++) s += buffer.getChannelData(c)[srcIdx];
    mono[i] = s / numChannels;
  }
  const bitDepth = 16;
  const dataLength = outLength * 2;
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, bufferLength - 8, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, TARGET_SAMPLE_RATE, true);
  view.setUint32(28, TARGET_SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, bitDepth, true);
  writeStr(36, 'data');
  view.setUint32(40, dataLength, true);
  let offset = 44;
  for (let i = 0; i < outLength; i++) {
    const s = Math.max(-1, Math.min(1, mono[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export default function VoiceAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [canStop, setCanStop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const minRecordTimerRef = useRef(null);

  const startRecording = useCallback(async () => {
    setError('');
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size < 2000) {
          setError('Recording too short. Speak for 2–3 seconds then tap Stop.');
          return;
        }
        let base64;
        let contentType = 'wav';
        try {
          const arrayBuffer = await blob.arrayBuffer();
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
          const wavBlob = audioBufferToWavBlob(decoded);
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(wavBlob);
          });
        } catch (e) {
          contentType = 'webm';
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
        if (!base64) {
          setError('Could not read recording');
          return;
        }
        setLoading(true);
        setError('');
        try {
          const data = await sendVoiceMessage(base64, contentType);
          setResult(data);
          if (data.audioBase64) {
            const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
            audio.play().catch(() => {});
          }
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Voice request failed');
        } finally {
          setLoading(false);
        }
      };
      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setCanStop(false);
      minRecordTimerRef.current = setTimeout(() => setCanStop(true), 2000);
    } catch (err) {
      setError('Microphone access denied or unavailable');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (minRecordTimerRef.current) {
      clearTimeout(minRecordTimerRef.current);
      minRecordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setRecording(false);
    setCanStop(false);
  }, []);

  if (!user) return null;

  return (
    <>
      {/* Floating button - bottom right */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-agri hover:shadow-agri-lg hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        aria-label="Open voice assistant"
      >
        <Mic size={26} strokeWidth={2} />
      </button>

      {/* Voice panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-agri-lg border border-primary-100 bg-white shadow-agri-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary-100 bg-primary-50/50">
            <span className="font-heading font-semibold text-bright-heading">Voice Assistant</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-bright-muted hover:bg-primary-100 hover:text-bright-body transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {result && (
              <div className="space-y-2 text-sm">
                {result.transcript && (
                  <p className="text-bright-muted">
                    <span className="font-semibold text-bright-body">You: </span>
                    {result.transcript}
                  </p>
                )}
                {result.reply && (
                  <p className="text-bright-body">
                    <span className="font-semibold text-primary-600">Assistant: </span>
                    {result.reply}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col items-center gap-3">
              {loading ? (
                <div className="flex items-center gap-2 text-bright-muted">
                  <Loader2 size={24} className="animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : recording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  disabled={!canStop}
                  className={`flex items-center gap-2 px-6 py-3 rounded-agri-lg font-semibold transition-colors ${canStop ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  <MicOff size={20} />
                  {canStop ? 'Stop & send' : 'Speak... (2s)'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-agri-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold shadow-agri hover:shadow-agri-lg transition-all"
                >
                  <Mic size={20} />
                  Tap to speak
                </button>
              )}
            </div>
            <p className="text-xs text-bright-muted text-center">
              Speak clearly for 2–3 seconds, then tap Stop. Ask about crops, weather, or schemes.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
