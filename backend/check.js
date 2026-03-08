const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyBXQEW-BMaorc-3A-JhPty3YkU85S7VEyA");

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
