"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/pemasukan",
    label: "Pemasukan",
    icon: TrendingUp,
  },
  {
    href: "/pengeluaran",
    label: "Pengeluaran",
    icon: TrendingDown,
  },
  {
    href: "/buka-puasa",
    label: "Buka Puasa",
    icon: Calendar,
  },
  {
    href: "/laporan",
    label: "Laporan",
    icon: FileText,
  },
];

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    // Implement logout functionality here
    alert("Menu akan segera hadir");
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-green-700 text-white shadow-2xl z-40",
        isOpen ? "w-64" : "w-16",
        !isOpen && "lg:w-16 w-0 overflow-hidden"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-green-600">
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image
              src="/Logo.jpg" 
              alt="Logo Masjid Al-Hikmah"
              width={32}
              height={32}
              className="rounded-lg object-cover"
            />
          </div>
          {isOpen && (
            <div>
              <h2 className="text-lg font-bold"> MASJID AL-HIKMAH</h2>
              
              <p className="text-xs text-green-200">Sistem Keuangan</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <div className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                  "hover:bg-green-600 hover:shadow-md",
                  isActive
                    ? "bg-green-600 shadow-md border-l-4 border-white"
                    : "text-green-100 hover:text-white",
                  !isOpen && "justify-center px-2"
                )}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-green-200")} />
                {isOpen && (
                  <span className={cn(isActive ? "text-white" : "text-green-100")}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-green-600 p-3">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 w-full",
            "text-green-100 hover:bg-red-600 hover:text-white hover:shadow-md",
            !isOpen && "justify-center px-2"
          )}
          title={!isOpen ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}