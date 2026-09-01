require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Please set GEMINI_API_KEY in your environment or .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

(async () => {
  try {
    const models = await genAI.listModels();

    console.log('Available models:\n');
    models.forEach(m => {
      console.log(
        m.name,
        '→ supports:',
        m.supportedGenerationMethods.join(', ')
      );
    });
  } catch (err) {
    console.error('Error listing models:', err.message);
  }
})();
