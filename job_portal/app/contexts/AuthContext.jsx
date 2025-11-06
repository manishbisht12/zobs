"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../../utils/auth.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const token = authAPI.getToken();
      const storedUser = authAPI.getUser();
      
      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Save token and user
        authAPI.setToken(token);
        authAPI.setUser(user);
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup({ name, email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Save token and user
        authAPI.setToken(token);
        authAPI.setUser(user);
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message || 'Signup failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success && response.data) {
        const user = response.data.user;
        authAPI.setUser(user);
        setUser(user);
        return { success: true, user };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


