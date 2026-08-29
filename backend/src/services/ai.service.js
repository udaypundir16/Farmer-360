/**
 * AI Service - Sarvam API
 * Handles chat completions, speech-to-text, and text-to-speech using a single Sarvam API key.
 */

const SARVAM_BASE = 'https://api.sarvam.ai';

function getApiKey() {
  const key = (process.env.SARVAM_API_KEY || '').trim();
  if (!key) throw new Error('SARVAM_API_KEY is missing in environment');
  return key;
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'api-subscription-key': getApiKey(),
  };
}

// In-memory conversation store (use DB/Redis in production)
const conversations = new Map();

const SYSTEM_PROMPT = `You are an experienced agricultural advisor helping farmers in India.

Rules:
- Speak in simple, farmer-friendly language
- Give practical, real-world advice
- Explain crops, pests, fertilizers, irrigation, and weather
- If exact prices or government schemes are unknown, explain generally and advise checking official sources
- Ask a follow-up question if it helps
- Do NOT sound like a chatbot or FAQ
- Keep replies concise for voice (2-3 short sentences when possible)`;

/**
 * Fallback to Gemini if Sarvam chat fails
 */
async function fallbackGemini(message) {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  if (!key) return null;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (e) {
    console.error('Gemini fallback error:', e.message);
    return null;
  }
}

/**
 * Chat completion using Sarvam LLM (sarvam-105b-conversations / sarvam-105b)
 * @param {string} userId
 * @param {string} message
 * @param {string} [language] - optional, e.g. 'en'
 */
async function farmerAIAgent(userId, message, language = 'en') {
  try {
    const history = conversations.get(userId) || [];
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.text,
      })),
      { role: 'user', content: message },
    ];

    const res = await fetch(`${SARVAM_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        model: 'sarvam-105b-conversations',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Sarvam chat error:', res.status, err);
      // Try Gemini fallback
      const geminiReply = await fallbackGemini(message);
      if (geminiReply) return geminiReply;
      return 'Sorry, I am unable to help right now. Please try again later.';
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'I could not generate a response.';

    // Save conversation (last 10 messages)
    history.push({ role: 'user', text: message });
    history.push({ role: 'model', text: reply });
    conversations.set(userId, history.slice(-10));

    return reply;
  } catch (error) {
    console.error('Sarvam chat error:', error.message);
    const geminiReply = await fallbackGemini(message);
    if (geminiReply) return geminiReply;
    return 'Sorry, I am unable to help right now. Please try again later.';
  }
}

/**
 * Speech-to-text using Sarvam (Saaras v3)
 * @param {Buffer} audioBuffer - raw audio (WAV or WebM)
 * @param {string} [codec] - 'wav' or 'webm'
 * @returns {Promise<{ transcript: string, language_code?: string }>}
 */
async function speechToText(audioBuffer, codec = 'wav') {
  const FormData = require('form-data');
  const axios = require('axios');
  const form = new FormData();
  form.append('model', 'saaras:v3');
  form.append('mode', 'transcribe');
  form.append('language_code', 'en-IN');
  form.append('input_audio_codec', codec === 'webm' ? 'webm' : 'wav');
  const filename = codec === 'webm' ? 'audio.webm' : 'audio.wav';
  const mime = codec === 'webm' ? 'audio/webm' : 'audio/wav';
  form.append('file', audioBuffer, { filename, contentType: mime });

  try {
    const { data } = await axios.post(`${SARVAM_BASE}/speech-to-text`, form, {
      headers: {
        'api-subscription-key': getApiKey(),
        ...form.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    const transcript = (data.transcript || '').trim();
    if (!transcript) {
      console.warn('Sarvam STT returned empty transcript. Buffer length:', audioBuffer.length, 'Response:', JSON.stringify(data));
    }
    return { transcript, language_code: data.language_code };
  } catch (err) {
    const msg = err.response?.data?.error?.message || 'Speech recognition failed';
    console.error('Sarvam STT error:', err.response?.status, err.response?.data);
    throw new Error(msg);
  }
}

/**
 * Text-to-speech using Sarvam (bulbul v3)
 * @param {string} text
 * @param {string} [targetLanguageCode] - e.g. 'en-IN', 'hi-IN'
 * @returns {Promise<string>} base64 audio
 */
async function textToSpeech(text, targetLanguageCode = 'en-IN') {
  const res = await fetch(`${SARVAM_BASE}/text-to-speech`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      text,
      target_language_code: targetLanguageCode,
      model: 'bulbul:v3',
      speaker: 'shubh',
      pace: 1,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Sarvam TTS error:', res.status, err);
    throw new Error(err?.error?.message || 'Text-to-speech failed');
  }

  const data = await res.json();
  const audioBase64 = data.audios?.[0];
  if (!audioBase64) throw new Error('No audio in TTS response');
  return audioBase64;
}

/**
 * Voice round-trip: STT -> Chat -> TTS (for voice assistant)
 * @param {string} userId
 * @param {Buffer} audioBuffer
 * @param {string} [codec]
 * @param {string} [language]
 * @returns {Promise<{ transcript: string, reply: string, audioBase64: string }>}
 */
async function voiceAssistant(userId, audioBuffer, codec = 'wav', language = 'en') {
  const { transcript, language_code } = await speechToText(audioBuffer, codec);
  let langCode = 'en-IN';
  if (language === 'hi' || (language_code && language_code.startsWith('hi'))) {
    langCode = 'hi-IN';
  } else if (language === 'pa' || (language_code && language_code.startsWith('pa'))) {
    langCode = 'pa-IN';
  } else if (language === 'ta' || (language_code && language_code.startsWith('ta'))) {
    langCode = 'ta-IN';
  }

  let reply;
  if (!transcript || !transcript.trim()) {
    if (langCode.startsWith('hi')) {
      reply = 'मैं आपकी बात नहीं सुन सका। कृपया 2-3 सेकंड स्पष्ट बोलें और पुनः प्रयास करें।';
    } else if (langCode.startsWith('pa')) {
      reply = 'ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਨਹੀਂ ਸੁਣ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ 2-3 ਸਕਿੰਟ ਸਾਫ਼ ਬੋਲੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।';
    } else if (langCode.startsWith('ta')) {
      reply = 'எனக்கு சரியாக கேட்கவில்லை. தயவுசெய்து 2-3 வினாடிகள் தெளிவாக பேசி மீண்டும் முயற்சிக்கவும்.';
    } else {
      reply = "I didn't catch that. Please speak clearly for 2–3 seconds and try again.";
    }
  } else {
    reply = await farmerAIAgent(userId, transcript.trim(), language);
  }
  const audioBase64 = await textToSpeech(reply, langCode);
  return { transcript: (transcript || '').trim(), reply, audioBase64 };
}

module.exports = {
  farmerAIAgent,
  speechToText,
  textToSpeech,
  voiceAssistant,
};
