import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, Phone, Lock, Key } from 'lucide-react';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      const user = await login(`+91${data.phone}`, data.password);
      
      // Check if user is admin
      if (!user?.isAdmin) {
        setError('This account does not have admin privileges');
        return;
      }
      
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setValue('phone', '9876543210');
    setValue('password', 'Farmer@123');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-fixed bg-center bg-no-repeat bg-cover py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundImage: "url('/images/page_bg.jpg')" }}
    >
      {/* Soft Backdrop Overlay */}
      <div className="absolute inset-0 bg-cream-100/70 backdrop-blur-[2px] pointer-events-none" />


      <div className="max-w-md w-full space-y-6 relative z-10 animate-fade-in-up">
        {/* Logo Header */}
        <div className="text-center">
          <Link to="/" className="inline-block hover:scale-[1.02] transition-transform">
            <img
              src="/images/farmer360_logo.png"
              alt="Farmer-360 Logo"
              className="h-16 sm:h-20 w-auto mx-auto object-contain mb-2 drop-shadow-md"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={14} className="text-red-600" />
            <span>Admin Management Portal</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-agri-lg p-6 sm:p-8 border border-red-100/80">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 font-heading">
              System Admin Sign In
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Authorized personnel access only
            </p>
          </div>

          {/* Quick Demo Admin Fill Option */}
          <div className="mb-5 p-3 rounded-xl bg-orange-50/80 border border-orange-200 flex items-center justify-between text-xs text-orange-950 font-medium">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-orange-600 flex-shrink-0" />
              <span>Demo Admin Credentials</span>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="px-2.5 py-1 rounded-md bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors shadow-sm"
            >
              Fill Demo Admin
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone size={14} className="text-red-600" />
                <span>Admin Mobile Number</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 text-gray-900 font-medium placeholder-gray-400 text-sm transition-all"
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                  ⚠️ {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock size={14} className="text-red-600" />
                <span>Admin Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 text-gray-900 font-medium placeholder-gray-400 text-sm transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-700 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                  ⚠️ {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-700 text-xs font-semibold">❌ {error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-base mt-2 min-h-[44px]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⌛</span>
                  <span>Verifying credentials...</span>
                </span>
              ) : (
                'Admin Login'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Not an admin?{' '}
              <Link to="/login" className="font-bold text-red-700 hover:underline">
                Sign In as Regular User →
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-600 font-medium">
          Admin sessions are audited and monitored.
        </p>
      </div>
    </div>
  );
}
