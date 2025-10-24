"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Bookmark, MessageSquare, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = () => router.push("/jobs");
  const handleProfile = () => router.push("/Profile");
  const handleEmployer = () => router.push("/Employer"); // Navigate to Employer page

  // Only show login/signup on specific pages (e.g., home "/")
  const showAuthButtons = pathname === "/"; 

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/Zobs.png"
              alt="Zobs Logo"
              width={200}
              height={50}
              priority
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            {showAuthButtons ? (
              <>
                <button
                  onClick={handleLogin}
                  className="px-6 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
                >
                  Login
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {/* Icons */}
                <button className="text-gray-700 hover:text-blue-600 transition-colors">
                  <Bookmark size={24} />
                </button>
                <button className="text-gray-700 hover:text-blue-600 transition-colors">
                  <MessageSquare size={24} />
                </button>
                <button
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={handleProfile}
                >
                  <User size={24} />
                </button>

                {/* Vertical Divider */}
                <div className="border-l h-6 border-gray-300"></div>

                {/* Employers / Post Job */}
                <span
                  onClick={handleEmployer}
                  className="text-gray-700 font-medium cursor-pointer hover:text-blue-600"
                >
                  Employers / Post Job
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
