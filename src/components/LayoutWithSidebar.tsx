"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

export function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  // Default sidebar terbuka di desktop untuk mengurangi "goyang"
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-close sidebar on mobile, keep open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Call on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-container min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-700 text-white p-2 rounded-md shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content */}
      <div
        className={`${sidebarOpen ? "lg:ml-64" : "lg:ml-16"} flex flex-col min-h-screen`}
      >
        <main className="flex-1 p-4 lg:p-6">
          {/* Mobile header */}
          <div className="lg:hidden mb-6 pt-12">
            <h1 className="text-2xl font-bold text-gray-800">Sistem Keuangan Masjid</h1>
          </div>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="px-4 lg:px-6">
            <div className="text-center text-sm text-gray-600">
              <p>© 2026 Masjid Al-Hikmah • Develop by <span className="font-semibold text-green-600">Baso_Hamzah</span></p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Default export untuk kompatibilitas
export default LayoutWithSidebar;
