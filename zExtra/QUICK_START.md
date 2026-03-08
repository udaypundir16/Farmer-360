# Quick Start Guide - Smart Agri Platform

## ⚡ 5-Minute Setup

### Step 1: Navigate to Project
```bash
cd c:\Desktop\Dextrix\smart-agri-platform\smart-agri-platform
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✓ Server running on http://localhost:5000
✓ Environment: development
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v4.5.14  ready in 1195 ms
➜  Local:   http://localhost:3000/
```

### Step 4: Open in Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

---

## 🔑 Default Login

Since this is development mode without Supabase configured, you can:

1. **Create Account**: Click "Register" on login page
   - Fill in phone, password, full name
   - Complete registration

2. **Login**: Use the credentials you just created

---

## 📁 Project Structure Overview

```
smart-agri-platform/
├── backend/              Backend API (Node.js + Express)
│   ├── src/
│   │   ├── server.js     Entry point
│   │   ├── app.js        Express config
│   │   ├── config/       Configs
│   │   ├── controllers/  Route handlers
│   │   ├── services/     Business logic
│   │   ├── routes/       API endpoints
│   │   └── middleware/   Auth & validation
│   ├── .env              Settings
│   └── package.json
│
├── frontend/             React Frontend (Vite)
│   ├── src/
│   │   ├── pages/        Page components
│   │   ├── components/   Reusable components
│   │   ├── services/     API calls
│   │   ├── context/      State management
│   │   └── i18n/         Translations
│   ├── index.html
│   ├── .env.local        Settings
│   └── package.json
│
├── README.md             Main documentation
├── PROJECT_SUMMARY.md    Complete project details
└── QUICK_START.md        This file
```

---

## 🎨 App Features

### Pages
- **Dashboard** - Weather, prices, alerts, schemes summary
- **Markets** - Search and analyze commodity prices
- **Schemes** - Browse and apply for government schemes
- **AI Chat** - Ask questions, get farming advice
- **Alerts** - Create price alerts for commodities
- **Profile** - Manage account and preferences

### Features
- 🌍 Multilingual (English, Hindi, Tamil)
- 📱 Mobile responsive
- 🎯 Real-time price tracking
- 🤖 AI-powered adviser
- 🔔 Smart notifications
- 📊 Charts & analytics

---

## 🛠 Key Technologies

**Backend** (Port 5000)
- Node.js + Express.js
- Supabase (Database)
- Redis (Caching)
- JWT (Auth)
- Google Gemini (AI)
- Twilio (SMS/WhatsApp)

**Frontend** (Port 3000)
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- i18next

---

## ⚙️ Customization

### Change API URL (Frontend)
Edit `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000/api/v1
```

### Change Backend Port
Edit `backend/.env`:
```
PORT=5000
```

### Add More Languages
Edit `frontend/src/i18n/locales/[lang]/translation.json`

---

## 🚀 Development Tips

### Watch Logs
```bash
# Terminal
tail -f backend/error.log
```

### Test API Endpoints
```bash
# Using curl
curl http://localhost:5000/health

# Using Postman
- Import API collection
- Set auth tokens
- Test endpoints
```

### Hot Reload
- **Backend**: Saved changes auto-reload with nodemon
- **Frontend**: Vite hot module reload (HMR)

---

## 📖 API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "password": "secure123",
    "fullName": "Farmer Name",
    "state": "Rajasthan"
  }'
```

### Get Market Prices
```bash
curl http://localhost:5000/api/v1/market/latest
```

### Search Globally
```bash
curl "http://localhost:5000/api/v1/search/global?q=wheat"
```

---

## 🔗 Useful Links

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

---

## ❓ Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### Port 5000 Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### node_modules Issues
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Vite Cache Issues
```bash
cd frontend
rm -rf .vite
npm run dev
```

---

## 📞 Next Steps

1. **Setup Supabase**
   - Create project at supabase.com
   - Copy URL and anon key to `.env`

2. **Setup Environment Keys**
   - Get Gemini API key from Google AI Studio
   - Get Twilio credentials
   - Get OpenWeather API key

3. **Create Database Tables**
   - Run migration scripts in Supabase
   - Create users, schemes, prices, alerts tables

4. **Deploy**
   - Frontend: Vercel, Netlify, or Railway
   - Backend: Railway, Render, or AWS EC2

---

## 📄 License

MIT License - See LICENSE file

---

**Happy Coding!** 🚀 Let's help farmers thrive! 🌾
