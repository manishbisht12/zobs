"use client";

import EmployerSidebar from "../../components/EmployerSidebar";
import Breadcrumb from "../../components/Breadcrumb";

export default function EmployerLayout({ children }) {
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



