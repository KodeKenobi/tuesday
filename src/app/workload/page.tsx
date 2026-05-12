"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Search,
  Clock as ClockIcon,
  Zap,
  AlertCircle,
  Eye,
  Edit,
  CheckCircle2,
  Ticket,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
    bgColor: "bg-gray-500/10",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color:
      "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
    icon: Zap,
    bgColor: "bg-blue-500/10",
  },
  REVISIONS: {
    label: "Revisions",
    color:
      "bg-yellow-100 text-yellow-900 border border-yellow-400 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
    icon: AlertCircle,
    bgColor: "bg-yellow-500/10",
  },
  CLIENT_REVIEW: {
    label: "Client Review",
    color:
      "bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30",
    icon: Eye,
    bgColor: "bg-indigo-500/10",
  },
  COMPLETE: {
    label: "Complete",
    color:
      "bg-green-100 text-green-800 border border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
    icon: CheckCircle2,
    bgColor: "bg-green-500/10",
  },
};

export default function WorkloadPage() {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTickets = useCallback(async () => {
    try {
      setError("");
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      params.set("myWorkload", "1");
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
  }, [statusFilter, user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTickets();
    }
  }, [statusFilter, authLoading, user, fetchTickets]);

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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Workload
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tickets assigned to you or created by you
            </p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-200/80 dark:border-gray-800/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
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

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-200/80 dark:border-gray-800/50">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              No tickets in your workload
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
              Tickets assigned to you or created by you will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-200/80 dark:border-gray-800/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800/50">
                    <th className="text-left p-6 text-gray-600 dark:text-gray-400 font-medium">
                      Title
                    </th>
                    <th className="text-left p-6 text-gray-600 dark:text-gray-400 font-medium">
                      Status
                    </th>
                    <th className="text-left p-6 text-gray-600 dark:text-gray-400 font-medium">
                      Client
                    </th>
                    <th className="text-left p-6 text-gray-600 dark:text-gray-400 font-medium">
                      Role
                    </th>
                    <th className="text-left p-6 text-gray-600 dark:text-gray-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => {
                    const status =
                      statusConfig[ticket.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={ticket.id}
                        className="border-b border-gray-100 dark:border-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                      >
                        <td className="p-6">
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {ticket.title}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Created by {ticket.creator.name}
                            </p>
                          </div>
                        </td>
                        <td className="p-6">
                          <span
                            className={cn(
                              "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border",
                              status.color,
                            )}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{status.label}</span>
                          </span>
                        </td>
                        <td className="p-6">
                          <p className="text-gray-700 dark:text-gray-300">
                            {ticket.client?.name || "No client"}
                          </p>
                        </td>
                        <td className="p-6">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                              ticket.assignee?.id === user.id
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400",
                            )}
                          >
                            {ticket.assignee?.id === user.id
                              ? "Assignee"
                              : "Creator"}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 relative group"
                              title="View ticket details"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                View details
                              </span>
                            </button>
                            <button
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 relative group"
                              title="Edit ticket"
                            >
                              <Edit className="w-4 h-4" />
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                Edit ticket
                              </span>
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 p-1 relative group"
                              title="Delete ticket"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                Delete ticket
                              </span>
                            </button>
                            <select
                              value={ticket.status}
                              onChange={(e) =>
                                handleStatusChange(ticket.id, e.target.value)
                              }
                              className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg px-2 py-1 text-gray-900 dark:text-white text-xs focus:border-indigo-500 focus:outline-none"
                            >
                              {Object.entries(statusConfig).map(
                                ([key, config]) => (
                                  <option key={key} value={key}>
                                    {config.label}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
