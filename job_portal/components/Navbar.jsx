"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Bookmark, MessageSquare, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = () => {
    router.push("/jobs");
  };

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
            {pathname === "/jobs" ? (
              // Show icons on /jobs page
              <>
                <button className="text-gray-700 hover:text-blue-600 transition-colors">
                  <Bookmark size={24} /> {/* Save Jobs */}
                </button>
                <button className="text-gray-700 hover:text-blue-600 transition-colors">
                  <MessageSquare size={24} /> {/* Messages */}
                </button>
                <button className="text-gray-700 hover:text-blue-600 transition-colors">
                  <User size={24} /> {/* Profile */}
                </button>
              </>
            ) : (
              // Show Login/Sign Up on other pages
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}