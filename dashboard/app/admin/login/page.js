"use client";

import { Shield } from 'lucide-react';
import LoginForm from '../../../components/auth/LoginForm';

export default function AdminLoginPage() {
  const handleLogin = async () => {
    // TODO: Implement actual API call for admin login
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      title="Admin Login"
      subtitle="Access the administrative dashboard"
      icon={Shield}
      theme="gray"
      redirectPath="/admin/dashboard"
      signupPath="/admin/signup"
    />
  );
}

