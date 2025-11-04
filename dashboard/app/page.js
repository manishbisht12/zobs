"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard after 2 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center text-white">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-3xl">Z</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to Zobs</h1>
        <p className="text-xl mb-6 text-white/90">Redirecting to dashboard...</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transition shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
