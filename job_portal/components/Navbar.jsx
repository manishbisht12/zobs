"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Bookmark, MessageSquare, User } from "lucide-react";
import BookmarksDropdown from "./BookmarksDropdown";
import { useJobs } from "../app/contexts/JobsContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const { hasNewBookmark, clearNotification, bookmarkedJobs } = useJobs();

  const handleLogin = () => router.push("/Login");
  const handleSignup = () => router.push("/Signup");
  const handleProfile = () => router.push("/Profile");
  const handleEmployer = () => router.push("/Employer");
  const handleLogoClick = () => router.push("/"); // Logo click
  const handleBookmarkClick = () => {
    setShowBookmarks(!showBookmarks);
    if (!showBookmarks && hasNewBookmark) {
      clearNotification(); // Clear notification when opening dropdown
    }
  };

  // Only show login/signup on specific pages (e.g., home "/")
  const showAuthButtons = pathname === "/";

  // Helper component for icon with tooltip
  const IconWithTooltip = ({ Icon, label, onClick }) => (
    <div className="relative flex flex-col items-center group cursor-pointer" onClick={onClick}>
      <Icon size={24} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
      
      {/* Tooltip */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        {label}
        {/* Thin arrow pointing up */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
            <Image
              src="/zobs.png"
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
  {/* Login Button with Border */}
  <button
    onClick={handleLogin}
    className="px-6 py-2 text-[rgb(77,70,217)] border border-[rgb(77,70,217)] rounded-lg font-medium hover:bg-[rgb(77,70,217)] hover:text-white transition-colors duration-200"
  >
    Login
  </button>

  {/* Divider Line */}
  <div className="border-l h-6 border-gray-300"></div>

  {/* Sign Up Button with Solid Background */}
  <button 
    onClick={handleSignup}
    className="px-6 py-2 bg-[rgb(77,70,217)] text-white font-medium rounded-lg hover:bg-[rgb(67,60,197)] transition-colors duration-200"
  >
    Sign Up
  </button>
</>



            ) : (
              <>
                {/* Icons with tooltip */}
                <div className="relative">
                  <div className="relative">
                    <IconWithTooltip Icon={Bookmark} label="Bookmarks" onClick={handleBookmarkClick} />
                    {hasNewBookmark && bookmarkedJobs.length > 0 && (
                      <span 
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center cursor-pointer"
                        onClick={handleBookmarkClick}
                      >
                        {bookmarkedJobs.length}
                      </span>
                    )}
                  </div>
                  <BookmarksDropdown isOpen={showBookmarks} onClose={() => setShowBookmarks(false)} />
                </div>
                <IconWithTooltip Icon={MessageSquare} label="Messages" />
                <IconWithTooltip Icon={User} label="Profile" onClick={handleProfile} />

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
