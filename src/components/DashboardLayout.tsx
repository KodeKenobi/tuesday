"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  Ticket,
  Users,
  Search,
  Bell,
  Plus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workload", href: "/workload", icon: Briefcase },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Clients", href: "/clients", icon: Users },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed left-0 top-0 h-full w-64 bg-[#1E1E1E] border-r border-[#2A2A2A]">
          <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
            <h1 className="text-xl font-bold text-white">Tuesday</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-[#B3B3B3] hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#6366F1] text-white"
                      : "text-[#B3B3B3] hover:text-white hover:bg-[#2A2A2A]"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <div className="flex h-full flex-col bg-[#1E1E1E] border-r border-[#2A2A2A]">
          <div className="flex items-center p-4 border-b border-[#2A2A2A]">
            <h1 className="text-xl font-bold text-white">Tuesday</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#6366F1] text-white"
                      : "text-[#B3B3B3] hover:text-white hover:bg-[#2A2A2A]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-[#1E1E1E] border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#B3B3B3] hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search everything, ask anything..."
                  className="w-96 pl-10 pr-4 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder-[#B3B3B3] focus:border-[#6366F1] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-[#B3B3B3] hover:text-white">
                <Bell className="w-5 h-5" />
              </button>

              {/* Create button */}
              <button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white p-2 rounded-lg hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200">
                <Plus className="w-5 h-5" />
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-[#B3B3B3]">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[#B3B3B3] hover:text-white"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
