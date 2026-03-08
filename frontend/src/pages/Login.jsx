import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Leaf, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await login(`+91${data.phone}`, data.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Gradient Blobs */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="login-container max-w-md w-full space-y-8 relative z-10">
        {/* Logo Section */}
        <div className="logo-section text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <Leaf size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
            Smart Agri
          </h1>
          <p className="text-gray-600 text-sm">Intelligent Farming Platform</p>
        </div>

        {/* Form Section */}
        <div className="card max-w-md mx-auto backdrop-blur-xl border border-emerald-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome Back</h2>
          <p className="text-gray-600 text-center text-sm mb-6">Sign in to your farming dashboard</p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                })}
                className="form-input"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  ⚠️ {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="form-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  ⚠️ {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-700 text-sm font-medium">❌ {error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button btn-primary transition-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⌛</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to Smart Agri?</span>
            </div>
          </div>

          {/* Register Link */}
          <a
            href="/register"
            className="block w-full text-center py-3 px-4 rounded-lg border-2 border-emerald-200 text-emerald-600 font-semibold"
          >
            Create an Account
          </a>

          {/* Admin Login Link */}
          <a
            href="/admin-login"
            className="block w-full text-center py-2 px-4 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Admin Login →
          </a>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-600">
          By signing in, you agree to our{' '}
          <a href="#" className="text-emerald-600 font-semibold hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}