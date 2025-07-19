"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Filter } from "lucide-react";
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
  BACKLOG: "status-backlog",
  IN_PROGRESS: "status-in-progress",
  REVISIONS: "status-revisions",
  CLIENT_REVIEW: "status-client-review",
  COMPLETE: "status-complete",
};

const statusLabels = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In Progress",
  REVISIONS: "Revisions",
  CLIENT_REVIEW: "Client Review",
  COMPLETE: "Complete",
};

export default function WorkloadPage() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/tickets?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();

      // Filter tickets assigned to current user or created by current user
      const filteredTickets = data.filter(
        (ticket: Ticket) =>
          ticket.assignee?.id === user?.id || ticket.creator.id === user?.id
      );

      setTickets(filteredTickets);
    } catch (error) {
      setError("Failed to load tickets");
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket");
      }

      // Refresh tickets
      fetchTickets();
    } catch (error) {
      setError("Failed to update ticket status");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Workload</h1>
          <p className="text-[#B3B3B3]">
            Tickets assigned to you or created by you
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 mb-6 border border-[#2A2A2A]">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-[#B3B3B3]" />
            <span className="text-[#B3B3B3] font-medium">
              Filter by status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white focus:border-[#6366F1] focus:outline-none"
            >
              <option value="">All Statuses</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
            <p className="text-[#EF4444]">{error}</p>
          </div>
        )}

        {/* Tickets list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#B3B3B3] text-lg">
              No tickets in your workload
            </p>
            <p className="text-[#B3B3B3] text-sm mt-2">
              Tickets assigned to you or created by you will appear here
            </p>
          </div>
        ) : (
          <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Title
                    </th>
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Status
                    </th>
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Client
                    </th>
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Role
                    </th>
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Created
                    </th>
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      className={cn(
                        "border-b border-[#2A2A2A] hover:bg-[#2A2A2A]/50 transition-colors",
                        index % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#1E1E1E]"
                      )}
                    >
                      <td className="p-6">
                        <div>
                          <p className="text-white font-medium">
                            {ticket.title}
                          </p>
                          <p className="text-[#B3B3B3] text-sm">
                            Created by {ticket.creator.name}
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            statusColors[
                              ticket.status as keyof typeof statusColors
                            ]
                          )}
                        >
                          {
                            statusLabels[
                              ticket.status as keyof typeof statusLabels
                            ]
                          }
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="text-[#B3B3B3]">
                          {ticket.client?.name || "No client"}
                        </p>
                      </td>
                      <td className="p-6">
                        <p className="text-[#B3B3B3]">
                          {ticket.assignee?.id === user.id
                            ? "Assignee"
                            : "Creator"}
                        </p>
                      </td>
                      <td className="p-6">
                        <p className="text-[#B3B3B3] text-sm">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-6">
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket.id, e.target.value)
                          }
                          className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-1 text-white text-sm focus:border-[#6366F1] focus:outline-none"
                        >
                          {Object.entries(statusLabels).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
