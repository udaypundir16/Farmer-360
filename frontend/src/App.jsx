import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, search]);
  return null;
}
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Schemes from './pages/Schemes';
import AIChat from './pages/AIChat';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/AdminDashboard';
import CropCalendar from './pages/CropCalendar';
import MarketTrends from './pages/MarketTrends';
import WeatherForecast from './pages/WeatherForecast';
import ShipmentDashboard from './pages/ShipmentDashboard';
import ProfitCalculator from './pages/ProfitCalculator';
import CommunityForum from './pages/CommunityForum';
import Prediction from './pages/Prediction';
import CropMarket from './pages/CropMarket';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure app is ready before rendering
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <div className="min-h-screen flex items-center justify-center">Initializing...</div>;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="markets" element={<Markets />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="search" element={<SearchResults />} />
          <Route path="admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="crop-calendar" element={<CropCalendar />} />
          <Route path="market-trends" element={<MarketTrends />} />
          <Route path="weather-forecast" element={<WeatherForecast />} />
          <Route path="shipments" element={<ProtectedRoute><ShipmentDashboard /></ProtectedRoute>} />
          <Route path="profit-calculator" element={<ProfitCalculator />} />
          <Route path="community-forum" element={<CommunityForum />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="crop-market" element={<CropMarket />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
