# Smart Agricultural Intelligence Platform

A comprehensive agricultural platform providing real-time market prices, government schemes, AI-powered farming advice, and price alerts for farmers.

## 🌾 Features

- **Real-time Market Prices**: Get up-to-date commodity prices from major markets
- **Government Schemes**: Browse and apply for agricultural schemes
- **AI Chat Assistant**: Get personalized farming advice powered by Google Gemini AI
- **Price Alerts**: Set alerts for commodity price thresholds
- **Weather Information**: Current weather and forecasts for your area
- **Multi-language Support**: Available in English, Hindi, and Tamil
- **User Dashboard**: Personalized dashboard with recommendations

## 🏗️ Architecture

The platform consists of two main components:

- **Frontend**: React-based SPA with Vite, TailwindCSS, and React Router
- **Backend**: Node.js/Express REST API with Supabase (or mock database for development)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (optional - mock database available for development)
- Redis (optional - for queue management)
- OpenWeather API key (for weather features)
- Google Gemini API key (for AI chat)

## 🚀 Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd smart-agri-platform/backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

**Note**: If you don't have Supabase credentials, the app will automatically use an in-memory mock database for development.

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd smart-agri-platform/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
smart-agri-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Utility functions
│   │   ├── validations/     # Joi validation schemas
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── package.json
│   └── .env.example

## 📦 Importing Government Scheme Data

## 🌤️ Weather Feature

The weather section now fully supports retrieving data for the user's current geographic
location by using the browser's Geolocation API. When you visit the dashboard or the
weather forecast page it will prompt for location permission; if granted the app will
fetch real-time weather/forecast using those coordinates. You can still manually set
latitude/longitude in your profile as a fallback.


To keep the scheme details page populated with the most recent government information you can pull data from an official open-data endpoint and upsert it into the `schemes` table. A helper script has been added at `backend/scripts/fetchGovtSchemes.js` as an example.

Adjust the source URL and field mappings to match the real government API you are using, then run:

```bash
node backend/scripts/fetchGovtSchemes.js
```

Once the database contains the current government dataset, clicking **View Details** on any scheme will display all of the available fields (description, eligibility, benefits, application process, department, funding amount, contact info, etc.).

│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   │   ├── ai/          # AI chat components
    │   │   ├── alerts/      # Alert components
    │   │   ├── auth/        # Authentication components
    │   │   ├── dashboard/   # Dashboard widgets
    │   │   ├── layout/      # Layout components
    │   │   ├── market/      # Market components
    │   │   ├── profile/     # Profile components
    │   │   ├── schemes/     # Scheme components
    │   │   └── ui/          # Reusable UI components
    │   ├── context/         # React context providers
    │   ├── i18n/            # Internationalization
    │   ├── pages/           # Page components
    │   ├── services/        # API service functions
    │   ├── App.jsx           # Main app component
    │   └── main.jsx         # Entry point
    ├── package.json
    └── .env.local.example
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user

### User Management
- `GET /api/v1/users/profile` - Get user profile (protected)
- `PUT /api/v1/users/profile` - Update user profile (protected)
- `POST /api/v1/users/change-password` - Change password (protected)
- `GET /api/v1/users/notification-preferences` - Get notification preferences (protected)
- `PUT /api/v1/users/notification-preferences` - Update notification preferences (protected)
- `GET /api/v1/users/applications` - Get user's scheme applications (protected)
- `GET /api/v1/users/alerts` - Get user's price alerts (protected)
- `POST /api/v1/users/delete-account` - Delete user account (protected)

### Market Prices
- `GET /api/v1/market/latest` - Get latest market prices
- `GET /api/v1/market/history` - Get price history
- `GET /api/v1/market/trends` - Get price trends

### Government Schemes
- `GET /api/v1/schemes` - Get all schemes
- `GET /api/v1/schemes/:id` - Get scheme by ID
- `POST /api/v1/schemes` - Create scheme (admin only)
- `PUT /api/v1/schemes/:id` - Update scheme (admin only)
- `DELETE /api/v1/schemes/:id` - Delete scheme (admin only)

### AI Chat
- `POST /api/v1/ai/chat` - Chat with AI assistant (protected, rate-limited)

### Price Alerts
- `POST /api/v1/alerts` - Create price alert (protected)
- `GET /api/v1/alerts` - Get user's alerts (protected)
- `PUT /api/v1/alerts/:id` - Update alert (protected)
- `DELETE /api/v1/alerts/:id` - Delete alert (protected)

### Weather
- `GET /api/v1/weather/current` - Get current weather
- `GET /api/v1/weather/forecast` - Get weather forecast

### Search
- `GET /api/v1/search/global` - Global search across schemes, commodities, and markets

### Notifications
- `GET /api/v1/notifications` - Get user notifications (protected)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## 🌍 Internationalization

The platform supports multiple languages:
- English (en)
- Hindi (hi)
- Tamil (ta)

Language preferences are stored in user profiles and can be changed in settings.

## 🗄️ Database

The platform uses Supabase (PostgreSQL) for production. For development without Supabase credentials, an in-memory mock database is automatically used.

### Database Schema (Supabase)

Key tables:
- `users` - User accounts
- `schemes` - Government schemes
- `scheme_applications` - User scheme applications
- `market_prices` - Commodity prices
- `price_alerts` - User price alerts
- `notification_preferences` - User notification settings

## 🛠️ Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Environment Variables

### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `REDIS_URL` - Redis connection URL
- `TWILIO_ACCOUNT_SID` - Twilio account SID (for SMS/WhatsApp)
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_WHATSAPP_NUMBER` - Twilio WhatsApp number
- `GEMINI_API_KEY` - Google Gemini API key
- `OPENWEATHER_API_KEY` - OpenWeather API key

### Frontend (.env.local)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api/v1)

## 🧪 Testing

Run tests (when implemented):
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Dependencies

### Backend
- Express - Web framework
- Supabase - Database
- JWT - Authentication
- Bcrypt - Password hashing
- Winston - Logging
- Helmet - Security
- CORS - Cross-origin resource sharing
- Joi - Validation
- Bull - Job queue
- Twilio - SMS/WhatsApp notifications

### Frontend
- React - UI library
- React Router - Routing
- Axios - HTTP client
- React Hook Form - Form handling
- i18next - Internationalization
- Recharts - Charts
- TailwindCSS - Styling
- Lucide React - Icons

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify all environment variables are set
- Check database connection (if using Supabase)

### Frontend won't connect to backend
- Verify `VITE_API_URL` in `.env.local` matches backend URL
- Ensure backend is running
- Check CORS settings in backend

### Authentication issues
- Verify JWT_SECRET is set in backend
- Check token expiration settings
- Clear localStorage and try logging in again

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue on the repository.

---

Built with ❤️ for farmers
