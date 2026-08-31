import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, ShieldCheck, User, Phone, Lock, CheckCircle } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        setError('');
        await loginWithGoogle({ access_token: tokenResponse.access_token });
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Google Sign-Up failed. Please try again.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google Sign-Up Error:', errorResponse);
      setError('Google Sign-Up was cancelled or failed.');
      setIsGoogleLoading(false);
    }
  });

  const handleGoogleSignUp = () => {
    setError('');
    googleLoginTrigger();
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
          <p className="text-soil-dark font-semibold text-sm">
            Join Farmer-360 Intelligent Platform
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-agri-lg p-6 sm:p-8 border border-primary-100/80">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-primary-950 font-heading">
              Create Free Account
            </h2>
            <p className="text-soil-light text-xs sm:text-sm mt-1">
              Start receiving live prices, AI guidance & subsidy alerts
            </p>
          </div>

          {/* Google Sign Up Option */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-bold hover:bg-gray-50 hover:shadow-md active:scale-[0.99] transition-all duration-200 shadow-sm min-h-[44px]"
            >
              {isGoogleLoading ? (
                <span className="flex items-center gap-2">Connecting...</span>
              ) : (
                <>
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
              <span className="px-3 bg-white text-gray-500 rounded-full border border-gray-200">
                or register with details
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-primary-600" />
                <span>Full Name</span>
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium placeholder-gray-400 text-sm transition-all"
              />
              {errors.fullName && (
                <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                  ⚠️ {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone size={14} className="text-primary-600" />
                <span>Mobile Number</span>
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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium placeholder-gray-400 text-sm transition-all"
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                  ⚠️ {errors.phone.message}
                </p>
              )}
              {phoneValue && phoneValue.length === 10 && !errors.phone && (
                <p className="text-green-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> Valid phone number
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock size={14} className="text-primary-600" />
                <span>Password</span>
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium placeholder-gray-400 text-sm transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-700 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                  ⚠️ {errors.password.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {pwd && (
                <div className="mt-2.5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">Password Strength</span>
                    <span className={`text-xs font-bold ${strength === 1 ? 'text-red-600' :
                        strength === 2 ? 'text-orange-600' :
                          strength === 3 ? 'text-yellow-600' :
                            'text-green-600'
                      }`}>
                      {strength === 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(strength / 4) * 100}%`,
                        backgroundColor: strength === 1 ? '#ef4444' : strength === 2 ? '#f97316' : strength === 3 ? '#eab308' : '#22c55e'
                      }}
                    />
                  </div>
                </div>
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
              className="w-full py-3.5 px-4 rounded-xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-agri hover:shadow-agri-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-base mt-2 min-h-[44px]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⌛</span>
                  <span>Creating account...</span>
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-soil-light">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-primary-700 hover:underline">
                Sign In to Existing Account →
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-soil-dark font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-primary-700" />
          <span>Encrypted & Secured by Farmer-360 Platform</span>
        </p>
      </div>
    </div>
  );
}