import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Leaf, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
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
      const user = await login(`+91${data.phone}`, data.password);
      
      // Check if user is admin
      if (!user.isAdmin) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Gradient Blobs */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="login-container max-w-md w-full space-y-8 relative z-10">
        {/* Logo Section */}
        <div className="logo-section text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
              <Leaf size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 text-sm">Smart Agri Admin Management</p>
        </div>

        {/* Form Section */}
        <div className="card max-w-md mx-auto backdrop-blur-xl border border-red-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Admin Login</h2>
          <p className="text-gray-600 text-center text-sm mb-6">Access admin dashboard with admin privileges</p>

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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
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
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-700 text-sm font-medium">❌ {error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⌛</span>
                  Logging in...
                </span>
              ) : (
                'Admin Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Not an admin?</span>
            </div>
          </div>

          {/* User Login Link */}
          <Link
            to="/login"
            className="block w-full text-center py-3 px-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            Sign In as Regular User
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-600">
          Admin accounts only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
