import api from './api';

export const sendMessage = async (message, language = 'en') => {
  const response = await api.post('/ai/chat', { message, language });
  return response.data;
};

/**
 * Send voice (base64 audio) to Sarvam: STT -> Chat -> TTS. Returns { transcript, reply, audioBase64 }.
 * @param {string} audioBase64
 * @param {string} [contentType] - 'wav' or 'webm' (default 'wav')
 * @param {string} [language] - 'en', 'hi', 'pa', 'ta'
 */
export const sendVoiceMessage = async (audioBase64, contentType = 'wav', language = 'en') => {
  const response = await api.post('/ai/voice', { audio: audioBase64, contentType, language });
  return response.data;
};
