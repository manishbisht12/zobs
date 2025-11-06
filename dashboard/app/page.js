"use client";

import { useRouter } from 'next/navigation';
import { Shield, Briefcase, ArrowRight, Users, BarChart3, Settings, FileText } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleCardClick = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-4xl">Z</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Zobs</h1>
          <p className="text-xl text-gray-600">Choose your dashboard to get started</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <div
            onClick={() => handleCardClick('/admin/dashboard')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-gray-200 hover:border-gray-900 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-8 relative">
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Admin Dashboard</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage users, jobs, and platform settings. Access comprehensive analytics and administrative controls.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-gray-900" />
                  <span className="text-sm font-medium">User Management</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="w-5 h-5 text-gray-900" />
                  <span className="text-sm font-medium">Job Management</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <BarChart3 className="w-5 h-5 text-gray-900" />
                  <span className="text-sm font-medium">Analytics & Reports</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Settings className="w-5 h-5 text-gray-900" />
                  <span className="text-sm font-medium">Platform Settings</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick('/admin/login');
                  }}
                  className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Login
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick('/admin/signup');
                  }}
                  className="w-full border-2 border-gray-900 text-gray-900 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          {/* Employer Card */}
          <div
            onClick={() => handleCardClick('/employer/dashboard')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-blue-200 hover:border-blue-600 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="p-8 relative">
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Employer Dashboard</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage your job postings, review applications, and track performance. Find the best talent for your company.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Post & Manage Jobs</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Review Applications</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Performance Analytics</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Company Settings</span>
                </div>
        </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick('/employer/login');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" />
                  Login
                </button>
        <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick('/employer/signup');
                  }}
                  className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  Sign Up
        </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
