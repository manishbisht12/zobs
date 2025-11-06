"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, needsReAuth } from '../utils/auth';
import { toast } from 'react-toastify';

/**
 * Hook to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const useAuthCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // List of public routes that don't require authentication
    const publicRoutes = ['/employer/login', '/employer/signup', '/'];
    const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));
    
    // If it's a public route, don't check authentication
    if (isPublicRoute) {
      return;
    }
    
    // Check if user needs to re-authenticate
    if (needsReAuth()) {
      // Clear any invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      toast.error('Session expired. Please login again.', {
        position: "top-right",
        autoClose: 3000,
      });
      
      router.push('/employer/login');
    }
  }, [pathname, router]);
};

