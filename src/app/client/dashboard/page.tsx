"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, AlertCircle, Clock, User } from "lucide-react";
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

export default function ClientDashboardPage() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
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

  if (!user || user.role !== "CLIENT") {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#B3B3B3] text-lg">Access denied</p>
          <p className="text-[#B3B3B3] text-sm mt-2">
            Only clients can access this page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <div className="bg-[#1E1E1E] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Client Portal</h1>
                <p className="text-[#B3B3B3]">Welcome back, {user.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/auth/login";
              }}
              className="text-[#B3B3B3] hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Tickets</h2>
          <p className="text-[#B3B3B3]">
            Review and manage your project tickets
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
            <p className="text-[#EF4444]">{error}</p>
          </div>
        )}

        {/* Tickets */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-[#B3B3B3]" />
            </div>
            <p className="text-[#B3B3B3] text-lg">No tickets assigned to you</p>
            <p className="text-[#B3B3B3] text-sm mt-2">
              Tickets will appear here once they are assigned to you
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-[#1E1E1E] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {ticket.title}
                    </h3>
                    <p className="text-[#B3B3B3] text-sm">
                      Created by {ticket.creator.name} on{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      statusColors[ticket.status as keyof typeof statusColors]
                    )}
                  >
                    {statusLabels[ticket.status as keyof typeof statusLabels]}
                  </span>
                </div>

                {/* Action buttons for client review status */}
                {ticket.status === "CLIENT_REVIEW" && (
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => handleStatusChange(ticket.id, "COMPLETE")}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Complete</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(ticket.id, "REVISIONS")}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#FACC15] text-[#1F2937] rounded-lg hover:bg-[#EAB308] transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Request Revisions</span>
                    </button>
                  </div>
                )}

                {/* Status message */}
                {ticket.status === "COMPLETE" && (
                  <div className="mt-4 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
                    <p className="text-[#22C55E] text-sm flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>This ticket has been marked as complete</span>
                    </p>
                  </div>
                )}

                {ticket.status === "REVISIONS" && (
                  <div className="mt-4 p-3 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-lg">
                    <p className="text-[#FACC15] text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Revisions have been requested</span>
                    </p>
                  </div>
                )}

                {ticket.status === "IN_PROGRESS" && (
                  <div className="mt-4 p-3 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-lg">
                    <p className="text-[#3B82F6] text-sm flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>This ticket is currently in progress</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
