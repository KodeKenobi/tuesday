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
  Settings,
  User,
  ChevronDown,
  Zap,
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
  Star,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Workload", href: "/workload", icon: Briefcase, badge: "3" },
  { name: "Tickets", href: "/tickets", icon: Ticket, badge: "12" },
  { name: "Clients", href: "/clients", icon: Users, badge: null },
];

const quickActions = [
  { name: "New Ticket", icon: Plus, href: "/tickets/new" },
  { name: "New Client", icon: Users, href: "/clients/new" },
  { name: "Reports", icon: TrendingUp, href: "/reports" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
];

const notifications = [
  {
    id: 1,
    title: "New ticket assigned",
    description: "Website redesign project has been assigned to you",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "Client feedback received",
    description: "John Smith left feedback on logo design",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Project completed",
    description: "E-commerce website project marked as complete",
    time: "3 hours ago",
    unread: false,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
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
              <h1 className="text-xl font-bold text-white">Tuesday</h1>
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
                    "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
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
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-indigo-500/20 text-indigo-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
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
              <h1 className="text-xl font-bold text-white">Tuesday</h1>
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
                    "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-indigo-500/20 text-indigo-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
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
              <div className="absolute bottom-20 left-4 right-4 bg-gray-800/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-xl">
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className="border-gray-700/50" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
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
                  <div className="absolute right-0 top-12 w-64 bg-gray-800/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-xl z-50">
                    <div className="p-2">
                      <h3 className="px-3 py-2 text-sm font-medium text-gray-400">
                        Quick Actions
                      </h3>
                      <div className="space-y-1">
                        {quickActions.map((action) => (
                          <Link
                            key={action.name}
                            href={action.href}
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                            onClick={() => setShowQuickActions(false)}
                          >
                            <action.icon className="w-4 h-4" />
                            <span>{action.name}</span>
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

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-gray-800/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-xl z-50">
                    <div className="p-4 border-b border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white">
                          Notifications
                        </h3>
                        <button className="text-xs text-indigo-400 hover:text-indigo-300">
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors cursor-pointer",
                            notification.unread && "bg-indigo-500/10"
                          )}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                notification.unread
                                  ? "bg-indigo-500"
                                  : "bg-gray-600"
                              )}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-700/50">
                      <button className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Backdrop for dropdowns */}
      {(showNotifications || showQuickActions || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowQuickActions(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
}
