"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  Power,
  Moon,
  Sun,
  BarChart3,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTeam } from "@/contexts/TeamContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    teams,
    activeTeamId,
    setActiveTeamId,
    isAllTeams,
    setAllTeamsMode,
    loading: teamNavLoading,
  } = useTeam();

  const navigation =
    user?.role === "SUPER_ADMIN"
      ? [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "Executive", href: "/executive", icon: BarChart3 },
          { name: "Projects", href: "/projects", icon: FolderKanban },
          { name: "Workload", href: "/workload", icon: Briefcase },
          { name: "Tickets", href: "/tickets", icon: Ticket },
          { name: "Clients", href: "/clients", icon: Users },
          { name: "Teams", href: "/teams", icon: Users },
        ]
      : [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "Projects", href: "/projects", icon: FolderKanban },
          { name: "Workload", href: "/workload", icon: Briefcase },
          { name: "Tickets", href: "/tickets", icon: Ticket },
          { name: "Clients", href: "/clients", icon: Users },
        ];
  const quickActions = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Workload", href: "/workload", icon: Briefcase },
    { name: "Projects", href: "/projects", icon: FolderKanban },
  ];

  const pathname = usePathname();
  const isClient = user?.role === "CLIENT";

  const handleLogout = async () => {
    try {
      await logout();
      window.location.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      window.location.replace("/");
    }
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
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed left-0 top-0 h-full w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Project Tracker
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-200/50">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-300/50 rounded-lg text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none text-sm"
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
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
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

          {!isClient && (
            <div className="p-4 border-t border-gray-200/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Team scope
                </h3>
                {user.role === "SUPER_ADMIN" && (
                  <Link
                    href="/teams"
                    className="text-xs font-medium text-indigo-600"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Manage
                  </Link>
                )}
              </div>
              {teamNavLoading ? (
                <p className="text-xs text-gray-500 px-1">Loading teams…</p>
              ) : user.role === "SUPER_ADMIN" ? (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAllTeamsMode(true);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                      isAllTeams
                        ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    All teams
                  </button>
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => {
                        setAllTeamsMode(false);
                        setActiveTeamId(team.id);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                        !isAllTeams && activeTeamId === team.id
                          ? "bg-gray-100 font-medium dark:bg-gray-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      )}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              ) : (
                <select
                  value={activeTeamId}
                  onChange={(e) => {
                    setActiveTeamId(e.target.value);
                    setSidebarOpen(false);
                  }}
                  disabled={teams.length === 0}
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Mobile User Info */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 transition-colors"
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
        <div className="flex h-full flex-col bg-white/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 text-dark-900">
                Project Tracker
              </h1>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="p-4 border-b border-gray-200/50">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-300/50 rounded-lg text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none text-sm"
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
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
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

          {!isClient && (
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                  Team scope
                </h3>
                {user.role === "SUPER_ADMIN" && (
                  <Link
                    href="/teams"
                    className="text-xs font-medium text-indigo-600"
                  >
                    Manage
                  </Link>
                )}
              </div>
              {teamNavLoading ? (
                <p className="text-xs text-gray-500 px-1">Loading teams…</p>
              ) : user.role === "SUPER_ADMIN" ? (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setAllTeamsMode(true)}
                    className={cn(
                      "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                      isAllTeams
                        ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    All teams
                  </button>
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => {
                        setAllTeamsMode(false);
                        setActiveTeamId(team.id);
                      }}
                      className={cn(
                        "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                        !isAllTeams && activeTeamId === team.id
                          ? "bg-gray-100 font-medium dark:bg-gray-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      )}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              ) : (
                <select
                  value={activeTeamId}
                  onChange={(e) => setActiveTeamId(e.target.value)}
                  disabled={teams.length === 0}
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Desktop User Info */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-20 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                <div className="p-3 space-y-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group">
                    <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Settings</span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
                  >
                    {theme === "light" ? (
                      <Moon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    ) : (
                      <Sun className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-medium">
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                  </button>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
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
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side - Navigation and Search */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-700 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Breadcrumb and Page Title */}
              <div className="hidden lg:flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="hover:text-gray-900 transition-colors cursor-pointer">
                    Dashboard
                  </span>
                  <span>/</span>
                  <span className="text-slate-900 font-medium">Overview</span>
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
                    className="w-80 pl-10 pr-4 py-2 bg-gray-100/90 border border-gray-300/50 rounded-lg text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none text-sm"
                  />
                </form>
              </div>

              {/* Mobile Search */}
              <div className="lg:hidden">
                <button className="text-gray-700 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg">
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
                  className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-2 rounded-lg hover:from-sky-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  title="Quick Actions"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {showQuickActions && (
                  <div className="absolute right-0 top-12 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl z-50">
                    <div className="p-3">
                      <h3 className="px-4 py-2 text-sm font-medium text-gray-500 mb-2">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        {quickActions.map((action) => (
                          <Link
                            key={action.name}
                            href={action.href}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
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
                className="text-gray-700 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
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
                  <span className="text-xs text-green-500 font-medium">
                    Online
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 shadow-lg group-hover:shadow-xl">
                      <span className="text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-300 rounded-full border-2 border-white group-hover:bg-gray-400 transition-colors"></div>
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 transition-all duration-200 p-2 hover:bg-gray-100 rounded-lg hover:shadow-lg"
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
