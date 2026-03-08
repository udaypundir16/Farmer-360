# Setup Guide

This guide will help you set up the Smart Agricultural Intelligence Platform from scratch.

## Prerequisites Checklist

- [ ] Node.js (v16 or higher) installed
- [ ] npm or yarn package manager
- [ ] Git (for cloning the repository)
- [ ] Code editor (VS Code recommended)
- [ ] Supabase account (optional - mock database available)
- [ ] OpenWeather API key (for weather features)
- [ ] Google Gemini API key (for AI chat features)

## Step-by-Step Setup

### 1. Clone and Navigate

```bash
# If you haven't already cloned the repository
git clone <repository-url>
cd smart-agri-platform
```

### 2. Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (Supabase) - Optional for development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Redis (Optional - for job queues)
REDIS_URL=redis://localhost:6379

# Twilio (Optional - for SMS/WhatsApp notifications)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# API Keys
GEMINI_API_KEY=your_google_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

**Important Notes:**
- If you don't have Supabase credentials, leave them as placeholders. The app will use an in-memory mock database.
- Generate a strong JWT_SECRET for production (use `openssl rand -base64 32`).
- Get your API keys:
  - **OpenWeather**: Sign up at https://openweathermap.org/api
  - **Google Gemini**: Get API key from https://makersuite.google.com/app/apikey

#### 2.3 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend should now be running on `http://localhost:5000`

Verify it's working:
```bash
curl http://localhost:5000/health
```

You should see: `{"status":"OK","timestamp":"..."}`

### 3. Frontend Setup

#### 3.1 Install Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

#### 3.2 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

**Note**: If your backend runs on a different port or URL, update this accordingly.

#### 3.3 Start Frontend Development Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000`

### 4. Verify Installation

1. **Backend Health Check**: Visit `http://localhost:5000/health`
2. **Frontend**: Visit `http://localhost:3000`
3. **Test Registration**: Try creating a new account
4. **Test Login**: Log in with your credentials

## Development Workflow

### Running Both Servers

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd smart-agri-platform/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd smart-agri-platform/frontend
npm run dev
```

### Making Changes

- **Backend changes**: The server will auto-reload with nodemon
- **Frontend changes**: Vite will hot-reload automatically

## Common Issues and Solutions

### Issue: Backend won't start

**Solution:**
- Check if port 5000 is already in use: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- Verify all required environment variables are set
- Check the console for specific error messages

### Issue: Frontend can't connect to backend

**Solution:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env.local` matches backend URL
- Check browser console for CORS errors
- Verify backend CORS settings allow frontend origin

### Issue: Database connection errors

**Solution:**
- If using Supabase: Verify credentials in `.env`
- If not using Supabase: The app should automatically use mock database
- Check backend console for database connection messages

### Issue: API key errors

**Solution:**
- Weather features: Ensure `OPENWEATHER_API_KEY` is set
- AI Chat: Ensure `GEMINI_API_KEY` is set
- These features will gracefully degrade if keys are missing

### Issue: npm install fails

**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try using `yarn` instead: `yarn install`

## Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name smart-agri-backend
   ```
3. Set up reverse proxy (nginx) for HTTPS
4. Configure environment variables on your hosting platform

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to a static hosting service (Vercel, Netlify, etc.)
3. Update `VITE_API_URL` to your production backend URL

## Next Steps

- Read the main [README.md](./README.md) for feature documentation
- Explore the API endpoints in the README
- Check out the component structure in `frontend/src/components`
- Review backend routes in `backend/src/routes`

## Getting Help

If you encounter issues:
1. Check the error messages in the console
2. Review the logs in `backend/combined.log` and `backend/error.log`
3. Verify all environment variables are correctly set
4. Ensure all dependencies are installed

---

Happy coding! 🌾
