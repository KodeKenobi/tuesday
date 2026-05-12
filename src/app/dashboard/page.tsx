"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTeam } from "@/contexts/TeamContext";
import DashboardLayout from "@/components/DashboardLayout";
import CreateTicketModal from "@/components/CreateTicketModal";
import TicketDetailModal from "@/components/TicketDetailModal";
import KanbanBoard from "@/components/KanbanBoard";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Clock as ClockIcon,
  Zap,
  AlertCircle,
  CheckCircle2,
  Users,
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
  team?: {
    id: string;
    name: string;
  } | null;
}

const statusConfig = {
  BACKLOG: {
    label: "Backlog",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    icon: ClockIcon,
    bgColor: "bg-gray-500/10",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Zap,
    bgColor: "bg-blue-500/10",
  },
  REVISIONS: {
    label: "Revisions",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: AlertCircle,
    bgColor: "bg-yellow-500/10",
  },
  CLIENT_REVIEW: {
    label: "Client Review",
    color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    icon: Eye,
    bgColor: "bg-indigo-500/10",
  },
  COMPLETE: {
    label: "Complete",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2,
    bgColor: "bg-green-500/10",
  },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    teams,
    activeTeamId,
    setActiveTeamId,
    isAllTeams,
    setAllTeamsMode,
    loading: teamListLoading,
  } = useTeam();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedView, setSelectedView] = useState<"kanban" | "list">("kanban");

  const fetchTickets = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);

      if (user.role === "USER") {
        if (!activeTeamId) {
          setTickets([]);
          setLoading(false);
          return;
        }
        params.append("teamId", activeTeamId);
      } else if (user.role === "SUPER_ADMIN") {
        if (!isAllTeams && activeTeamId) {
          params.append("teamId", activeTeamId);
        }
      }

      const response = await fetch(`/api/tickets?${params}`);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [user, statusFilter, activeTeamId, isAllTeams]);

  useEffect(() => {
    if (authLoading || !user) return;
    void fetchTickets();
  }, [authLoading, user, fetchTickets]);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update ticket");
      fetchTickets();
    } catch {}
  };

  const handleCreateTicket = async (ticketData: {
    title: string;
    status: string;
    clientId?: string;
    teamId: string;
  }) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      await response.json();

      fetchTickets();
      setShowCreateModal(false);
    } catch {}
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete ticket");

      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      setShowTicketDetail(false);
      setSelectedTicket(null);
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

  if (user.role === "SUPER_ADMIN") {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Super Admin Overview
              </h1>
              <p className="text-gray-600">
                Full project oversight and team management.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/executive"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Executive analytics
              </Link>
              <Link
                href="/teams"
                className="bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Manage teams
              </Link>
              <Link
                href="/projects"
                className="bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Projects
              </Link>
            </div>
          </div>
          {/* Add graphs and overview here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tickets
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter((t) => t.status === "IN_PROGRESS").length}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter((t) => t.status === "COMPLETE").length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Teams</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teams.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
          {/* Team selector for super admin */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-gray-600">Team scope</label>
            <select
              value={isAllTeams ? "__all__" : activeTeamId}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__all__") setAllTeamsMode(true);
                else {
                  setAllTeamsMode(false);
                  setActiveTeamId(v);
                }
              }}
              disabled={teamListLoading}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="__all__">All teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create ticket</span>
            </button>
          </div>
          {/* Kanban for overview */}
          <KanbanBoard
            tickets={filteredTickets}
            onStatusChange={handleStatusChange}
            onTicketClick={(ticket) => {
              setSelectedTicket(ticket);
              setShowTicketDetail(true);
            }}
            userRole={user.role}
            onCreateTicket={() => setShowCreateModal(true)}
          />

          <CreateTicketModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTicket}
            defaultTeamId={isAllTeams ? "" : activeTeamId}
            teams={teams}
          />

          <TicketDetailModal
            ticket={selectedTicket}
            isOpen={showTicketDetail}
            onClose={() => {
              setShowTicketDetail(false);
              setSelectedTicket(null);
            }}
            onStatusChange={handleStatusChange}
            onUpdate={async (ticketId, updates) => {
              try {
                const response = await fetch(`/api/tickets/${ticketId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updates),
                });
                if (!response.ok) throw new Error("Failed to update ticket");
                const updatedTicket = await response.json();
                setSelectedTicket(updatedTicket);
                fetchTickets();
              } catch (error) {
                console.error("Failed to update ticket:", error);
              }
            }}
            onDelete={handleDeleteTicket}
            user={user}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {user.role === "USER" && teams.length === 0 && !teamListLoading && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950 text-sm">
            You are not a member of any team yet. A department head (super admin)
            must add you to a team before you can load tickets.
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user.name}. Here&apos;s what&apos;s happening
              today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
              <button
                onClick={() => setSelectedView("kanban")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2",
                  selectedView === "kanban"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setSelectedView("list")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2",
                  selectedView === "list"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <span>List</span>
              </button>
            </div>

            {user.role === "USER" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Ticket</span>
              </button>
            )}
          </div>
        </div>

        {selectedView === "kanban" && (
          <div className="space-y-6">
            <div className="bg-white/50 backdrop-blur-xl rounded-xl border border-gray-200/50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets or clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-300/50 rounded-lg text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={activeTeamId}
                    onChange={(e) => setActiveTeamId(e.target.value)}
                    disabled={teamListLoading || teams.length === 0}
                    className="bg-gray-100/50 border border-gray-300/50 rounded-lg px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-100/50 border border-gray-300/50 rounded-lg px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
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

            <KanbanBoard
              tickets={filteredTickets}
              onStatusChange={handleStatusChange}
              onTicketClick={(ticket) => {
                setSelectedTicket(ticket);
                setShowTicketDetail(true);
              }}
              userRole={user.role}
              onCreateTicket={() => setShowCreateModal(true)}
            />
          </div>
        )}

        {selectedView === "list" && (
          <div className="space-y-6">
            <div className="bg-white/50 backdrop-blur-xl rounded-xl border border-gray-200/50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-300/50 rounded-lg text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    value={activeTeamId}
                    onChange={(e) => setActiveTeamId(e.target.value)}
                    disabled={teamListLoading || teams.length === 0}
                    className="bg-gray-100/50 border border-gray-300/50 rounded-lg px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-100/50 border border-gray-300/50 rounded-lg px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
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

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12 bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-lg mb-2">No tickets found</p>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                {user.role === "USER" && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                  >
                    Create your first ticket
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-6 text-gray-500 font-medium">
                          Title
                        </th>
                        <th className="text-left p-6 text-gray-500 font-medium">
                          Status
                        </th>
                        <th className="text-left p-6 text-gray-500 font-medium">
                          Client
                        </th>
                        <th className="text-left p-6 text-gray-500 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((ticket) => {
                        const status =
                          statusConfig[
                            ticket.status as keyof typeof statusConfig
                          ];
                        const StatusIcon = status.icon;

                        return (
                          <tr
                            key={ticket.id}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-6">
                              <div>
                                <p className="text-slate-900 font-medium">
                                  {ticket.title}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  by {ticket.creator.name}
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
                              <p className="text-gray-300">
                                {ticket.client?.name || "No client"}
                              </p>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-gray-500 hover:text-gray-900 p-1 relative group"
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    setShowTicketDetail(true);
                                  }}
                                  title="View ticket details"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white text-slate-900 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    View details
                                  </span>
                                </button>
                                <button
                                  className="text-gray-500 hover:text-gray-900 p-1 relative group"
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    setShowTicketDetail(true);
                                  }}
                                  title="Edit ticket"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white text-slate-900 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Edit ticket
                                  </span>
                                </button>
                                <select
                                  value={ticket.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      ticket.id,
                                      e.target.value,
                                    )
                                  }
                                  className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-gray-900 text-xs focus:border-indigo-500 focus:outline-none"
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
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <CreateTicketModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTicket}
          defaultTeamId={activeTeamId}
          teams={teams}
        />

        <TicketDetailModal
          ticket={selectedTicket}
          isOpen={showTicketDetail}
          onClose={() => {
            setShowTicketDetail(false);
            setSelectedTicket(null);
          }}
          onStatusChange={handleStatusChange}
          onUpdate={async (ticketId, updates) => {
            try {
              const response = await fetch(`/api/tickets/${ticketId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
              });

              if (!response.ok) throw new Error("Failed to update ticket");

              const updatedTicket = await response.json();
              setSelectedTicket(updatedTicket);
              fetchTickets(); // Refresh the list
            } catch (error) {
              console.error("Failed to update ticket:", error);
            }
          }}
          onDelete={handleDeleteTicket}
          user={user}
        />
      </div>
    </DashboardLayout>
  );
}
