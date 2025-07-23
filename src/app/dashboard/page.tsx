"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import CreateTicketModal from "@/components/CreateTicketModal";
import TicketDetailModal from "@/components/TicketDetailModal";
import KanbanBoard from "@/components/KanbanBoard";
import {
  Plus,
  Filter,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Star,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Ticket,
  Grid,
  List,
  Kanban,
  Settings,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  ChevronDown,
  UserPlus,
  FolderOpen,
  Tag,
  Flag,
  Clock as ClockIcon,
  CheckCircle2,
  XCircle,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
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
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

interface ActivityItem {
  id: string;
  type:
    | "ticket_created"
    | "ticket_updated"
    | "ticket_completed"
    | "comment_added";
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  ticketId?: string;
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
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: Eye,
    bgColor: "bg-purple-500/10",
  },
  COMPLETE: {
    label: "Complete",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2,
    bgColor: "bg-green-500/10",
  },
};

const priorityConfig = {
  LOW: {
    label: "Low",
    color: "bg-gray-500/20 text-gray-400",
    icon: Minus,
  },
  MEDIUM: {
    label: "Medium",
    color: "bg-yellow-500/20 text-yellow-400",
    icon: AlertCircle,
  },
  HIGH: {
    label: "High",
    color: "bg-orange-500/20 text-orange-400",
    icon: Flag,
  },
  URGENT: {
    label: "Urgent",
    color: "bg-red-500/20 text-red-400",
    icon: AlertCircle,
  },
};

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedView, setSelectedView] = useState<
    "kanban" | "list" | "analytics"
  >("kanban");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Mock activities
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "ticket_completed",
      title: "Website redesign completed",
      description: "Sarah marked the homepage redesign as complete",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      user: { name: "Sarah Chen" },
      ticketId: "ticket-1",
    },
    {
      id: "2",
      type: "ticket_updated",
      title: "Moved to Client Review",
      description: "Mike moved e-commerce integration to client review",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      user: { name: "Mike Rodriguez" },
      ticketId: "ticket-2",
    },
    {
      id: "3",
      type: "comment_added",
      title: "Feedback received",
      description: "Client left feedback on logo design",
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      user: { name: "TechStart Inc." },
      ticketId: "ticket-3",
    },
  ];

  useEffect(() => {
    fetchTickets();
    setActivities(mockActivities);
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (priorityFilter) params.append("priority", priorityFilter);

      const response = await fetch(`/api/tickets?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch tickets");

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

      if (!response.ok) throw new Error("Failed to update ticket");
      fetchTickets();
    } catch (error) {
      setError("Failed to update ticket status");
    }
  };

  const handleCreateTicket = async (ticketData: any) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      fetchTickets();
      setShowCreateModal(false);
    } catch (error) {
      setError("Failed to create ticket");
    }
  };

  // Analytics calculations
  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(
    (t) => t.status === "COMPLETE"
  ).length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const overdueTickets = tickets.filter((t) => {
    const created = new Date(t.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
    return daysDiff > 7 && t.status !== "COMPLETE";
  }).length;

  const completionRate =
    totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0;

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority =
      !priorityFilter || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aValue = a[sortBy as keyof Ticket] || "";
    const bValue = b[sortBy as keyof Ticket] || "";

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const groupedTickets = {
    BACKLOG: sortedTickets.filter((t) => t.status === "BACKLOG"),
    IN_PROGRESS: sortedTickets.filter((t) => t.status === "IN_PROGRESS"),
    REVISIONS: sortedTickets.filter((t) => t.status === "REVISIONS"),
    CLIENT_REVIEW: sortedTickets.filter((t) => t.status === "CLIENT_REVIEW"),
    COMPLETE: sortedTickets.filter((t) => t.status === "COMPLETE"),
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user.name}. Here's what's happening today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-900/50 backdrop-blur-sm rounded-xl p-1 border border-gray-800/50">
              <button
                onClick={() => setSelectedView("kanban")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2",
                  selectedView === "kanban"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Kanban className="w-4 h-4" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setSelectedView("list")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2",
                  selectedView === "list"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setSelectedView("analytics")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2",
                  selectedView === "analytics"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Tickets</p>
                <p className="text-2xl font-bold text-white">{totalTickets}</p>
                <p className="text-xs text-green-400 mt-1">
                  +12% from last week
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {completedTickets}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {completionRate.toFixed(1)}% completion rate
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-white">
                  {inProgressTickets}
                </p>
                <p className="text-xs text-blue-400 mt-1">Active development</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-white">
                  {overdueTickets}
                </p>
                <p className="text-xs text-red-400 mt-1">Needs attention</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {selectedView === "kanban" && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets, clients, or assignees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="">All Statuses</option>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="">All Priorities</option>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>

                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Drag and Drop Kanban Board */}
            <KanbanBoard
              tickets={sortedTickets}
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

        {/* List View */}
        {selectedView === "list" && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="">All Statuses</option>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="">All Priorities</option>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>

                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <FilterIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tickets Table */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : sortedTickets.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No tickets found</p>
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
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800/50">
                        <th className="text-left p-6 text-gray-400 font-medium">
                          Title
                        </th>
                        <th className="text-left p-6 text-gray-400 font-medium">
                          Status
                        </th>
                        <th className="text-left p-6 text-gray-400 font-medium">
                          Priority
                        </th>
                        <th className="text-left p-6 text-gray-400 font-medium">
                          Client
                        </th>
                        <th className="text-left p-6 text-gray-400 font-medium">
                          Assignee
                        </th>
                        <th className="text-left p-6 text-gray-400 font-medium">
                          Created
                        </th>
                        <th className="text-left p-6 text-gray-400 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTickets.map((ticket) => {
                        const status =
                          statusConfig[
                            ticket.status as keyof typeof statusConfig
                          ];
                        const priority = ticket.priority
                          ? priorityConfig[
                              ticket.priority as keyof typeof priorityConfig
                            ]
                          : null;
                        const StatusIcon = status.icon;
                        const PriorityIcon = priority?.icon;

                        return (
                          <tr
                            key={ticket.id}
                            className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors"
                          >
                            <td className="p-6">
                              <div>
                                <p className="text-white font-medium">
                                  {ticket.title}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  by {ticket.creator.name}
                                </p>
                              </div>
                            </td>
                            <td className="p-6">
                              <span
                                className={cn(
                                  "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border",
                                  status.color
                                )}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span>{status.label}</span>
                              </span>
                            </td>
                            <td className="p-6">
                              {ticket.priority && PriorityIcon && (
                                <span
                                  className={cn(
                                    "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                                    priority.color
                                  )}
                                >
                                  <PriorityIcon className="w-3 h-3" />
                                  <span>{priority.label}</span>
                                </span>
                              )}
                            </td>
                            <td className="p-6">
                              <p className="text-gray-300">
                                {ticket.client?.name || "No client"}
                              </p>
                            </td>
                            <td className="p-6">
                              <p className="text-gray-300">
                                {ticket.assignee?.name || "Unassigned"}
                              </p>
                            </td>
                            <td className="p-6">
                              <p className="text-gray-400 text-sm">
                                {new Date(
                                  ticket.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-gray-400 hover:text-white p-1"
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    setShowTicketDetail(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-gray-400 hover:text-white p-1">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <select
                                  value={ticket.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      ticket.id,
                                      e.target.value
                                    )
                                  }
                                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-white text-xs focus:border-indigo-500 focus:outline-none"
                                >
                                  {Object.entries(statusConfig).map(
                                    ([key, config]) => (
                                      <option key={key} value={key}>
                                        {config.label}
                                      </option>
                                    )
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

        {/* Analytics View */}
        {selectedView === "analytics" && (
          <div className="space-y-6">
            {/* Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    Ticket Status Distribution
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span>This Week</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(groupedTickets).map(([status, tickets]) => {
                    const config =
                      statusConfig[status as keyof typeof statusConfig];
                    const percentage =
                      (tickets.length / Math.max(totalTickets, 1)) * 100;

                    return (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              config.bgColor
                            )}
                          ></div>
                          <span className="text-gray-300">{config.label}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-800 rounded-full h-2">
                            <div
                              className={cn("h-2 rounded-full", config.bgColor)}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium w-8 text-right">
                            {tickets.length}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    Recent Activity
                  </h3>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                    View all
                  </button>
                </div>

                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Activity className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">
                          {activity.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {activity.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(activity.timestamp).toLocaleTimeString()} •{" "}
                          {activity.user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Create Ticket Modal */}
        <CreateTicketModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTicket}
        />

        {/* Ticket Detail Modal */}
        <TicketDetailModal
          ticket={selectedTicket}
          isOpen={showTicketDetail}
          onClose={() => {
            setShowTicketDetail(false);
            setSelectedTicket(null);
          }}
          onStatusChange={handleStatusChange}
          onDelete={(ticketId) => {
            // Handle delete if needed
            console.log("Delete ticket:", ticketId);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
