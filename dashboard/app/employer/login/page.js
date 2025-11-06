"use client";

import { Briefcase } from 'lucide-react';
import LoginForm from '../../../components/auth/LoginForm';

export default function EmployerLoginPage() {
  const handleLogin = async () => {
    // TODO: Implement actual API call for employer login
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      title="Employer Login"
      subtitle="Access your employer dashboard"
      icon={Briefcase}
      theme="blue"
      redirectPath="/employer/dashboard"
      signupPath="/employer/signup"
    />
  );
}

