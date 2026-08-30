import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Leaf, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const phoneValue = watch('phone');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      const formattedData = { 
        ...data, 
        phone: `+91${data.phone}`
      };
      await signup(formattedData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const pwd = watch('password');
  const strength = passwordStrength(pwd);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <style>{`
        @keyframes slideInCenter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .register-container {
          animation: slideInCenter 0.7s ease-out;
        }
        
        .logo-section {
          animation: float 3s ease-in-out infinite;
        }
        
        .form-input {
          transition: all 0.3s ease;
          border: 2px solid rgba(16, 185, 129, 0.1);
        }
        
        .form-input:focus {
          border-color: rgb(16, 185, 129);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
          transform: scale(1.02);
        }
        
        .form-input:valid {
          border-color: rgb(34, 197, 94);
        }
        
        .submit-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(16, 185, 129, 0.4);
        }
        
        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .error-message {
          animation: slideInCenter 0.3s ease-out;
        }
        
        .strength-bar {
          transition: all 0.3s ease;
          background: linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16);
          background-size: 400% 100%;
          background-position: 0% 0%;
        }
      `}</style>

      {/* Background Gradient Blobs */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="register-container max-w-md w-full space-y-8 relative z-10">
        {/* Logo Section */}
        <div className="logo-section text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <Leaf size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
            Join Farmer-360
          </h1>
          <p className="text-gray-600 text-sm">Start your intelligent farming journey today</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-emerald-100">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters'
                  }
                })}
                className="form-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white transition-colors"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  ⚠️ {errors.fullName.message}
                </p>
              )}
            </div>

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
                className="form-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white transition-colors"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  ⚠️ {errors.phone.message}
                </p>
              )}
              {phoneValue && phoneValue.length === 10 && !errors.phone && (
                <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                  <CheckCircle size={14} /> Valid phone number
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
                  placeholder="Enter a strong password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="form-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white transition-colors pr-12"
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

              {/* Password Strength Indicator */}
              {pwd && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">Password Strength</span>
                    <span className={`text-xs font-semibold ${strength === 1 ? 'text-red-600' :
                        strength === 2 ? 'text-orange-600' :
                          strength === 3 ? 'text-yellow-600' :
                            'text-green-600'
                      }`}>
                      {strength === 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="strength-bar h-full transition-all duration-300"
                      style={{
                        width: `${(strength / 4) * 100}%`,
                        backgroundPosition: `${100 - (strength / 4) * 100}% 0%`
                      }}
                    ></div>
                  </div>
                </div>
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
              className="submit-button w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-4 rounded-lg mt-6 shadow-lg transition-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⌛</span>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already registered?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center py-3 px-4 rounded-lg border-2 border-emerald-200 text-emerald-600 font-semibold"
          >
            Sign In to Existing Account
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-600">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-emerald-600 font-semibold hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}