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
  Plus,
  LogOut,
  Menu,
  X,
  Settings,
  User,
  ChevronDown,
  Zap,
  Power,
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

const quickActions = [
  { name: "New Ticket", icon: Plus, href: "/tickets/new" },
  { name: "New Client", icon: Users, href: "/clients/new" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50">
          <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">ClickDown</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-800/50">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none text-sm"
              />
            </form>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile User Info */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <div className="flex h-full flex-col bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50">
          <div className="flex items-center p-4 border-b border-gray-800/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">ClickDown</h1>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="p-4 border-b border-gray-800/50">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none text-sm"
              />
            </form>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Info */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-20 left-4 right-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl">
                <div className="p-3 space-y-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-200 group">
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-200 group">
                    <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Settings</span>
                  </button>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 rounded-xl transition-all duration-200 group"
                  >
                    <Power className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side - Navigation and Search */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Breadcrumb and Page Title */}
              <div className="hidden lg:flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Dashboard
                  </span>
                  <span>/</span>
                  <span className="text-white font-medium">Overview</span>
                </div>
              </div>

              {/* Desktop Search */}
              <div className="relative hidden lg:block">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets, clients, or anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-80 pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none text-sm"
                  />
                </form>
              </div>

              {/* Mobile Search */}
              <div className="lg:hidden">
                <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right side - Actions and User */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  title="Quick Actions"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {showQuickActions && (
                  <div className="absolute right-0 top-12 w-64 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl z-50">
                    <div className="p-3">
                      <h3 className="px-4 py-2 text-sm font-medium text-gray-400 mb-2">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        {quickActions.map((action) => (
                          <Link
                            key={action.name}
                            href={action.href}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-200 group"
                            onClick={() => setShowQuickActions(false)}
                          >
                            <action.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">{action.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Help Button */}
              <button
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
                title="Help"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* User Menu (Desktop) */}
              <div className="hidden lg:flex items-center space-x-4">
                {/* Status Indicator */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">
                    Online
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg group-hover:shadow-xl">
                      <span className="text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-600 rounded-full border-2 border-gray-900 group-hover:bg-gray-500 transition-colors"></div>
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-gray-800/50 rounded-lg hover:shadow-lg"
                  title="Sign Out"
                >
                  <Power className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Backdrop for dropdowns */}
      {(showQuickActions || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowQuickActions(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
}
