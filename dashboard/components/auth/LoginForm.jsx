"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginForm({ 
  onSubmit, 
  title, 
  subtitle, 
  icon: Icon, 
  theme = 'blue',
  redirectPath,
  signupPath
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onSubmit();
      router.push(redirectPath);
    } catch (error) {
      setErrors({ 
        general: 'An error occurred. Please try again.' 
      });
      setIsLoading(false);
    }
  };

  const isDark = theme === 'dark';
  const bgGradient = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
  const logoBg = isDark
    ? 'bg-white'
    : 'bg-gradient-to-br from-blue-600 to-blue-800';
  const logoText = isDark ? 'text-gray-900' : 'text-white';
  const titleColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const buttonBg = isDark
    ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700'
    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
  const linkColor = isDark ? 'text-gray-900 hover:text-gray-700' : 'text-blue-600 hover:text-blue-700';
  const backLinkColor = isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900';

  return (
    <div className={`min-h-screen ${bgGradient} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 ${logoBg} rounded-2xl flex items-center justify-center shadow-xl`}>
              <span className={`${logoText} font-bold text-4xl`}>Z</span>
            </div>
          </div>
          <h1 className={`text-4xl font-bold ${titleColor} mb-2`}>{title}</h1>
          <p className={subtitleColor}>{subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'focus:ring-gray-900' : 'focus:ring-blue-500'
                  } transition ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                  placeholder={isDark ? 'admin@example.com' : 'employer@example.com'}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'focus:ring-gray-900' : 'focus:ring-blue-500'
                  } transition ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className={`text-sm ${linkColor} font-medium transition`}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${buttonBg} text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 ${
                theme === 'dark' ? 'focus:ring-gray-900' : 'focus:ring-blue-500'
              } focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  {Icon && <Icon className="h-5 w-5" />}
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {signupPath && (
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <button
                  onClick={() => router.push(signupPath)}
                  className={`font-semibold ${linkColor} transition`}
                >
                  Create Account
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className={`text-sm ${backLinkColor} transition`}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

