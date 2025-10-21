"use client"; // ✅ Navbar uses browser interactions

import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/Zobs.png" // public folder
              alt="Zobs Logo"
              width={200}
              height={50}
              priority
            />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">
              Login
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
