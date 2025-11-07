"use client";

import { Briefcase } from 'lucide-react';
import LoginForm from '../../../components/auth/LoginForm';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { setAuth } from '../../../utils/auth';

export default function EmployerLoginPage() {
  const handleLogin = async (email, password) => {
    try {
      // Make API call to login endpoint
      const response = await api.post('/employer/auth/login', { email, password });
      
      if (response.data.success && response.data.data) {
        // Extract JWT token and user data from response
        const { token, user } = response.data.data;
        
        // Validate token exists
        if (!token) {
          toast.error('Login failed: No token received', {
            position: "top-right",
            autoClose: 3000,
          });
          return { success: false, message: 'No token received from server' };
        }
        
        // Save JWT token and user data using auth utility
        setAuth(token, user);
        
        // Show success message
        toast.success('Login successful! Redirecting...', {
          position: "top-right",
          autoClose: 2000,
        });
        
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error toast
      toast.error(error.message || 'Login failed. Please check your credentials.', {
        position: "top-right",
        autoClose: 3000,
      });
      
      return { 
        success: false, 
        message: error.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      title="Employer Login"
      subtitle="Access your employer dashboard"
      icon={Briefcase}
      theme="gray"
      redirectPath="/employer/dashboard"
      signupPath="/employer/signup"
    />
  );
}

