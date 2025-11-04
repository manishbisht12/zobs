"use client";

import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
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

