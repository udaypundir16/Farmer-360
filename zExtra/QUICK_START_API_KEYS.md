# Quick Start: Adding API Keys

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

### Step 2: Get Your OpenWeather API Key

1. Go to: **https://openweathermap.org/api**
2. Sign up (free account)
3. Go to **"API Keys"** tab
4. Copy your key

### Step 3: Add to Backend `.env`

Open `smart-agri-platform/backend/.env` and add:

```env
GEMINI_API_KEY=AIzaSy...your_key_here
OPENWEATHER_API_KEY=abc123...your_key_here
```

**Important:** 
- No quotes around the keys
- No spaces before/after
- Each key on its own line

### Step 4: Restart Backend

```bash
# Stop current server (Ctrl+C in backend terminal)
# Then restart:
cd smart-agri-platform/backend
npm run dev
```

### Step 5: Verify

Check backend console for:
- ✅ `✓ Gemini AI initialized` 
- ✅ Weather API working (no error messages)

## 🧪 Test It

### Test AI Chat:
1. Login to platform
2. Go to **AI Chat** page
3. Type: "Tell me about wheat farming"
4. Should get intelligent AI response!

### Test Weather:
1. Update profile with location (lat/lon)
2. Check Dashboard weather widget
3. Should show real weather data!

## ✅ Done!

Both features now work with real APIs! 🎉

---

**Note:** Without API keys, the platform still works with fallback responses, but they're less intelligent and not location-specific.
