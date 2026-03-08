import api from './api';

export const sendMessage = async (message) => {
  const response = await api.post('/ai/chat', { message });
  return response.data;
};

/**
 * Send voice (base64 audio) to Sarvam: STT -> Chat -> TTS. Returns { transcript, reply, audioBase64 }.
 * @param {string} audioBase64
 * @param {string} [contentType] - 'wav' or 'webm' (default 'wav')
 */
export const sendVoiceMessage = async (audioBase64, contentType = 'wav') => {
  const response = await api.post('/ai/voice', { audio: audioBase64, contentType });
  return response.data;
};
