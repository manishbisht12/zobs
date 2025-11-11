"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Briefcase, Check, Building2 } from 'lucide-react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { setAuth } from '../../../utils/auth';

export default function EmployerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    } else if (formData.company.trim().length < 2) {
      newErrors.company = 'Company name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Show loading toast
      const loadingToast = toast.loading('Creating your account...', {
        position: "top-right",
      });

      // Make API call for employer signup
      const response = await api.post('/employer/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.company,
      });
      
      if (response.data.success && response.data.data) {
        // Extract JWT token and user data from response
        const { token, user } = response.data.data;
        
        // Validate token exists
        if (!token) {
          toast.dismiss(loadingToast);
          toast.error('Signup failed: No token received', {
            position: "top-right",
            autoClose: 3000,
          });
          setIsLoading(false);
          return;
        }
        
        // Save JWT token and user data using auth utility
        setAuth(token, user);
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Account created successfully! Redirecting...', {
          position: "top-right",
          autoClose: 2000,
        });
        
        setIsLoading(false);
        router.push('/employer/dashboard');
      } else {
        toast.dismiss(loadingToast);
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      setIsLoading(false);
      
      let errorMessage = 'An error occurred. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      
      setErrors({ 
        general: errorMessage 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-4xl">Z</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employer Signup</h1>
          <p className="text-gray-600">Create your employer account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{errors.general}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.name}
                </p>
              )}
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition ${
                    errors.company ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                  placeholder="Enter your company name"
                />
              </div>
              {errors.company && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.company}
                </p>
              )}
            </div>

            {/* Email Field */}
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
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                  placeholder="employer@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
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
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-900 mb-2">Password Requirements:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-gray-900" />
                  At least 6 characters long
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-gray-900" />
                  Strong and unique password
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Briefcase className="h-5 w-5" />
                  Create Employer Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an employer account?{' '}
              <button
                onClick={() => router.push('/employer/login')}
                className="font-semibold text-gray-900 hover:text-gray-700 transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

