"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { clearAuth } from '../utils/auth';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/employer/dashboard' },
  { name: 'Jobs', icon: Briefcase, path: '/employer/jobs' },
  { name: 'Applications', icon: FileText, path: '/employer/applications' },
  { name: 'Analytics', icon: BarChart3, path: '/employer/analytics' },
  { name: 'Settings', icon: Settings, path: '/employer/settings' },
];

export default function EmployerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    // Clear JWT token and user data using auth utility
    clearAuth();
    
    // Show success toast
    toast.success('Logged out successfully!', {
      position: "top-right",
      autoClose: 2000,
    });
    
    // Redirect to home page
    router.push('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-white border-r border-gray-200
          shadow-2xl transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`border-b border-gray-200 transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-6'}`}>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              {!isCollapsed && (
                <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Zobs</h1>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 space-y-2 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Check if pathname matches exactly or starts with the item path
              // This allows sub-routes like /employer/jobs/post to highlight the Jobs menu
              const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center rounded-xl
                    transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-gray-900 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 gap-3'}
                  `}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                  {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                  {isCollapsed && isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-lg"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className={`border-t border-gray-200 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            <div className={`flex items-center rounded-xl bg-gray-50 border border-gray-200 mb-3 ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 gap-3'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-gray-900 font-medium text-sm">Employer</p>
                  <p className="text-gray-500 text-xs">employer@example.com</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleLogout}
              className={`flex items-center rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all w-full group ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 gap-3'}`}
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

