"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeam } from "@/contexts/TeamContext";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  Building,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Zap,
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

const statusConfig = {
  BACKLOG: {
    label: "Backlog",
    color:
      "bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30",
    icon: ClockIcon,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color:
      "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
    icon: Zap,
  },
  REVISIONS: {
    label: "Revisions",
    color:
      "bg-yellow-100 text-yellow-900 border border-yellow-400 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
    icon: AlertCircle,
  },
  CLIENT_REVIEW: {
    label: "Client Review",
    color:
      "bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30",
    icon: Eye,
  },
  COMPLETE: {
    label: "Complete",
    color:
      "bg-green-100 text-green-800 border border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
    icon: CheckCircle,
  },
};

export default function TicketsPage() {
  const { user } = useAuth();
  const {
    teams,
    activeTeamId,
    setActiveTeamId,
    isAllTeams,
    setAllTeamsMode,
    loading: teamLoading,
  } = useTeam();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode] = useState<"grid" | "list">("grid");

  const fetchTickets = useCallback(async () => {
    if (!user) return;
    if (user.role === "CLIENT") {
      setLoading(false);
      return;
    }
    try {
      setError("");
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append("status", statusFilter);
      }
      if (user.role === "USER") {
        if (!activeTeamId) {
          setTickets([]);
          setLoading(false);
          return;
        }
        params.set("teamId", activeTeamId);
      } else if (user.role === "SUPER_ADMIN") {
        if (!isAllTeams && activeTeamId) {
          params.set("teamId", activeTeamId);
        }
      }

      const response = await fetch(`/api/tickets?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch {
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, user, activeTeamId, isAllTeams]);

  useEffect(() => {
    if (user && user.role !== "CLIENT") fetchTickets();
  }, [statusFilter, fetchTickets, user]);

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
    } catch {}
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ticket");
      }

      fetchTickets();
    } catch {}
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.assignee?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              All Tickets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all your project tickets
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "USER" && (
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Ticket</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-800/50 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets, clients, or assignees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-3">
              <select
                value={
                  user.role === "SUPER_ADMIN"
                    ? isAllTeams
                      ? "__all__"
                      : activeTeamId
                    : activeTeamId
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (user.role === "SUPER_ADMIN") {
                    if (v === "__all__") setAllTeamsMode(true);
                    else {
                      setAllTeamsMode(false);
                      setActiveTeamId(v);
                    }
                  } else {
                    setActiveTeamId(v);
                  }
                }}
                disabled={teamLoading || teams.length === 0 || user.role === "CLIENT"}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                {user?.role === "SUPER_ADMIN" && (
                  <option value="__all__">All teams</option>
                )}
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="">All Statuses</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Tickets Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No tickets found
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "space-y-4",
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : ""
            )}
          >
            {filteredTickets.map((ticket) => {
              const status =
                statusConfig[ticket.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <div
                  key={ticket.id}
                  className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-200/80 dark:border-gray-800/50 p-6 hover:border-indigo-300/50 dark:hover:border-gray-700/50 transition-all duration-200 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white font-semibold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {ticket.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span
                          className={cn(
                            "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border",
                            status.color
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </span>
                      </div>
                    </div>

                    {user.role === "USER" && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTicket(ticket.id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title="Delete ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Building className="w-4 h-4" />
                      <span>{ticket.client?.name || "No client"}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{ticket.assignee?.name || "Unassigned"}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {user.role === "USER" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800/50">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(ticket.id, e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      >
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
