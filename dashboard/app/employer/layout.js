"use client";

import { usePathname } from 'next/navigation';
import EmployerSidebar from "../../components/EmployerSidebar";
import Breadcrumb from "../../components/Breadcrumb";
import { useAuthCheck } from "../../middleware/authCheck";

export default function EmployerLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/signup');

  // Check authentication for protected routes (hook must be called unconditionally)
  useAuthCheck();

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <EmployerSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  );
}

