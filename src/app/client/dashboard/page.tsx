"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Ticket,
  Sparkles,
  ArrowRight,
  Calendar,
  User as UserIcon,
  Power,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  client?: {
    id: string;
    name: string;
    email: string;
  };
}

const statusColors = {
  BACKLOG: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  REVISIONS: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CLIENT_REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  COMPLETE: "bg-green-500/10 text-green-400 border-green-500/20",
};

const statusLabels = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In Progress",
  REVISIONS: "Revisions",
  CLIENT_REVIEW: "Client Review",
  COMPLETE: "Complete",
};

const statusIcons = {
  BACKLOG: Clock,
  IN_PROGRESS: Clock,
  REVISIONS: AlertCircle,
  CLIENT_REVIEW: Sparkles,
  COMPLETE: CheckCircle,
};

export default function ClientDashboardPage() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets");

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket");
      }

      fetchTickets();
    } catch {
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  if (!user || user.role !== "CLIENT") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-red-500/20">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 max-w-sm">
            Only clients can access this portal. Please log in with your client
            account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Branding */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Client Portal
                  </h1>
                  <p className="text-xs text-gray-400">Project Management</p>
                </div>
              </div>
            </div>

            {/* Right side - User info and logout */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </div>
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

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Your Tickets
              </h1>
              <p className="text-gray-400 mt-1 text-lg">
                Review and manage your project tickets
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {tickets.length}
                  </p>
                  <p className="text-sm text-gray-400">Total Tickets</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {tickets.filter((t) => t.status === "COMPLETE").length}
                  </p>
                  <p className="text-sm text-gray-400">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {tickets.filter((t) => t.status === "CLIENT_REVIEW").length}
                  </p>
                  <p className="text-sm text-gray-400">Pending Review</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {tickets.filter((t) => t.status === "REVISIONS").length}
                  </p>
                  <p className="text-sm text-gray-400">Revisions</p>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Tickets */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <span className="text-gray-400 text-lg">
                Loading your tickets...
              </span>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-gray-800/50">
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No tickets assigned
            </h3>
            <p className="text-gray-400 max-w-md mx-auto text-lg">
              Tickets will appear here once they are assigned to you by your
              project team.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tickets.map((ticket, index) => {
              const StatusIcon =
                statusIcons[ticket.status as keyof typeof statusIcons];
              return (
                <div
                  key={ticket.id}
                  className="group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors">
                          {ticket.title}
                        </h3>
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="w-4 h-4" />
                          <span>Created by {ticket.creator.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium border flex items-center space-x-2",
                          statusColors[
                            ticket.status as keyof typeof statusColors
                          ]
                        )}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span>
                          {
                            statusLabels[
                              ticket.status as keyof typeof statusLabels
                            ]
                          }
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Action buttons for client review status */}
                  {ticket.status === "CLIENT_REVIEW" && (
                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={() =>
                          handleStatusChange(ticket.id, "COMPLETE")
                        }
                        className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-green-500/25 group/btn"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Mark Complete</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(ticket.id, "REVISIONS")
                        }
                        className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white rounded-xl hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 group/btn"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">Request Revisions</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Status messages */}
                  {ticket.status === "COMPLETE" && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl backdrop-blur-xl">
                      <p className="text-green-400 text-sm flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          This ticket has been marked as complete
                        </span>
                      </p>
                    </div>
                  )}

                  {ticket.status === "REVISIONS" && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl backdrop-blur-xl">
                      <p className="text-yellow-400 text-sm flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">
                          Revisions have been requested
                        </span>
                      </p>
                    </div>
                  )}

                  {ticket.status === "IN_PROGRESS" && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl backdrop-blur-xl">
                      <p className="text-blue-400 text-sm flex items-center space-x-3">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">
                          This ticket is currently in progress
                        </span>
                      </p>
                    </div>
                  )}

                  {ticket.status === "BACKLOG" && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-500/20 rounded-xl backdrop-blur-xl">
                      <p className="text-gray-400 text-sm flex items-center space-x-3">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">
                          This ticket is in the backlog
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
