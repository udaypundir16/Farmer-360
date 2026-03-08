# API Keys Setup Guide

## 🔑 Required API Keys

To enable full functionality of the AI Chat and Weather features, you need to configure API keys in your backend `.env` file.

### 1. Google Gemini API Key (for AI Chat)

**Get your API key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

**Add to `.env`:**
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Note:** The AI chat will work with fallback responses even without the API key, but responses will be more generic.

### 2. OpenWeather API Key (for Weather)

**Get your API key:**
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

**Add to `.env`:**
```env
OPENWEATHER_API_KEY=your_actual_openweather_api_key_here
```

**Note:** The weather feature will use mock data if the API key is not configured, but it won't be location-specific.

## 📝 Setup Steps

1. **Open backend `.env` file:**
   ```bash
   cd smart-agri-platform/backend
   # Edit .env file
   ```

2. **Add your API keys:**
   ```env
   GEMINI_API_KEY=AIzaSy...your_key_here
   OPENWEATHER_API_KEY=abc123...your_key_here
   ```

3. **Restart the backend server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

4. **Verify the keys are loaded:**
   - Check backend console for:
     - `✓ Gemini AI initialized` (if Gemini key is valid)
     - `✓ Using OpenWeather API` (if weather key is valid)

## ✅ Verification

### Test AI Chat:
1. Log in to the platform
2. Go to AI Chat page
3. Send a message like "Tell me about wheat farming"
4. You should get a detailed AI response (if Gemini key is configured)

### Test Weather:
1. Update your profile with location (latitude/longitude)
2. Go to Dashboard or Weather Forecast page
3. You should see real weather data (if OpenWeather key is configured)

## 🔄 Fallback Behavior

### Without API Keys:
- **AI Chat:** Uses intelligent fallback responses based on keywords
- **Weather:** Uses mock weather data (not location-specific)

### With API Keys:
- **AI Chat:** Uses Google Gemini AI for intelligent, contextual responses
- **Weather:** Uses OpenWeather API for real-time, location-specific weather

## 🛠️ Troubleshooting

### AI Chat not working:
- Check if you're logged in (AI Chat requires authentication)
- Verify `GEMINI_API_KEY` is set correctly in `.env`
- Check backend console for errors
- Restart backend server after adding key

### Weather not working:
- Verify user profile has latitude/longitude set
- Check if `OPENWEATHER_API_KEY` is set correctly
- Verify API key is valid (not expired)
- Check backend console for API errors

### Common Issues:

1. **"API key not configured"**
   - Make sure `.env` file exists in backend folder
   - Check that keys don't have quotes around them
   - Verify keys are on separate lines

2. **"Invalid API key"**
   - Verify the key is copied correctly (no extra spaces)
   - Check if the API key is still valid
   - For Gemini: Make sure you're using the correct API key from Google AI Studio

3. **"Rate limit exceeded"**
   - Wait a few minutes and try again
   - Check your API usage limits
   - Consider upgrading your API plan

## 📊 API Usage Limits

### Google Gemini (Free Tier):
- 15 requests per minute
- 1,500 requests per day

### OpenWeather (Free Tier):
- 60 calls per minute
- 1,000,000 calls per month

## 🔒 Security Notes

- **Never commit `.env` file to git**
- Keep your API keys secret
- Rotate keys if compromised
- Use environment-specific keys for production

## 💡 Tips

1. **Start with free tiers** - Both APIs offer generous free tiers
2. **Monitor usage** - Check API dashboards regularly
3. **Use caching** - The platform caches responses to reduce API calls
4. **Fallback is fine** - The platform works without API keys using fallbacks

---

**Need help?** Check the backend console logs for detailed error messages.
