"use client"; // ✅ Client Component because of React Icons & styled-jsx

import React from "react";
import { FiSearch, FiMapPin, FiBriefcase } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Your Dream Job
              </h1>
              <p className="text-xl text-gray-600">
                Thousands of jobs from top companies waiting for you
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Dream job"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                <FiSearch className="w-5 h-5" />
                <span>Search Jobs</span>
              </button>
            </div>

            {/* CTA */}
            <div className="flex items-center space-x-4">
              <button className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2">
                <FiBriefcase className="w-5 h-5" />
                <span>Post a Job</span>
              </button>
              <p className="text-sm text-gray-600">Are you an employer?</p>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:block relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="relative bg-white rounded-2xl shadow-2xl p-8">
              <svg
                className="w-full h-auto"
                viewBox="0 0 500 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Illustration shapes */}
                <rect x="100" y="250" width="300" height="120" rx="10" fill="#E0E7FF" />
                <circle cx="250" cy="180" r="50" fill="#818CF8" />
                <rect x="220" y="230" width="60" height="80" rx="5" fill="#6366F1" />
                <rect x="180" y="270" width="140" height="90" rx="5" fill="#4F46E5" />
                <rect x="190" y="280" width="120" height="70" fill="#818CF8" />
                <rect x="50" y="100" width="120" height="160" rx="8" fill="white" stroke="#4F46E5" strokeWidth="3" />
                <line x1="70" y1="130" x2="150" y2="130" stroke="#4F46E5" strokeWidth="2" />
                <line x1="70" y1="150" x2="150" y2="150" stroke="#818CF8" strokeWidth="2" />
                <line x1="70" y1="170" x2="130" y2="170" stroke="#818CF8" strokeWidth="2" />
                <circle cx="400" cy="120" r="40" fill="#10B981" />
                <path d="M385 120 L395 130 L415 110" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="80" cy="80" r="15" fill="#FCD34D" opacity="0.8" />
                <circle cx="420" cy="280" r="20" fill="#F87171" opacity="0.8" />
                <circle cx="350" cy="60" r="12" fill="#818CF8" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
