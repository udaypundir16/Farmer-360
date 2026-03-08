const aiService = require('../services/ai.service');

exports.chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;
    const language = req.body.language || req.user.languagePref || 'en';

    if (!message) return res.status(400).json({ message: 'Message is required' });

    const reply = await aiService.farmerAIAgent(userId, message, language);
    res.json({ reply });
  } catch (error) {
    next(error);
  }
};

/**
 * Voice assistant: accept base64 audio -> STT -> Chat -> TTS -> return transcript, reply, audio
 */
exports.voice = async (req, res, next) => {
  try {
    const { audio, contentType } = req.body; // base64 audio; contentType: 'wav' or 'webm'
    const userId = req.user.userId;

    if (!audio || typeof audio !== 'string') {
      return res.status(400).json({ message: 'Audio (base64) is required' });
    }

    const audioBuffer = Buffer.from(audio, 'base64');
    if (audioBuffer.length === 0) return res.status(400).json({ message: 'Invalid audio data' });

    const result = await aiService.voiceAssistant(userId, audioBuffer, contentType || 'wav');
    res.json(result);
  } catch (error) {
    next(error);
  }
};