"use client";

import { useState } from "react";
import {
  X,
  User,
  Calendar,
  Tag,
  Clock,
  MessageSquare,
  Edit,
  Trash2,
  Copy,
  Share2,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Star,
  Zap,
  Eye,
  Flag,
  Minus,
  Building,
  FileText,
  Link,
  Download,
  Paperclip,
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

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (ticketId: string, newStatus: string) => void;
  onDelete?: (ticketId: string) => void;
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
    icon: CheckCircle,
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

export default function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}: TicketDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");

  if (!isOpen || !ticket) return null;

  const status = statusConfig[ticket.status as keyof typeof statusConfig];
  const priority = ticket.priority
    ? priorityConfig[ticket.priority as keyof typeof priorityConfig]
    : null;
  const StatusIcon = status.icon;
  const PriorityIcon = priority?.icon;

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(ticket.id, newStatus);
  };

  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this ticket?")) {
      onDelete(ticket.id);
      onClose();
    }
  };

  const copyTicketLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/tickets/${ticket.id}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl z-10 flex items-center justify-between p-6 border-b border-gray-800/50">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white line-clamp-1">
                {ticket.title}
              </h2>
              <p className="text-sm text-gray-400">
                Created by {ticket.creator.name} •{" "}
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyTicketLink}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
              title="Copy link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
              title="Edit ticket"
            >
              <Edit className="w-4 h-4" />
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                title="Delete ticket"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-3 hover:bg-gray-800/50 rounded-lg hover:scale-110 border border-gray-700/50 hover:border-gray-600/50"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Description
                </h3>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  {ticket.description ? (
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No description provided
                    </p>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Comments
                </h3>
                <div className="space-y-4">
                  {/* Add Comment */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {ticket.creator.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                          rows={3}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-white transition-colors p-1">
                              <Paperclip className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors p-1">
                              <Link className="w-4 h-4" />
                            </button>
                          </div>
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Comments */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          M
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white font-medium text-sm">
                            Mike Rodriguez
                          </span>
                          <span className="text-gray-500 text-xs">
                            2 hours ago
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Started working on the payment integration. The API
                          documentation looks good, should be able to complete
                          this by Friday.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          T
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white font-medium text-sm">
                            TechStart Inc.
                          </span>
                          <span className="text-gray-500 text-xs">
                            1 day ago
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Looking forward to seeing the progress on this. Please
                          make sure to include the mobile responsive design as
                          discussed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Status
                </h3>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Priority
                </h3>
                {ticket.priority && priority ? (
                  <div
                    className={cn(
                      "inline-flex items-center space-x-2 px-3 py-2 rounded-lg border",
                      priority.color
                    )}
                  >
                    {PriorityIcon && <PriorityIcon className="w-4 h-4" />}
                    <span className="text-sm font-medium">
                      {priority.label}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No priority set
                  </p>
                )}
              </div>

              {/* Assignee */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Assignee
                </h3>
                <div className="flex items-center space-x-3">
                  {ticket.assignee ? (
                    <>
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {ticket.assignee.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {ticket.assignee.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {ticket.assignee.email}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm italic">Unassigned</p>
                  )}
                </div>
              </div>

              {/* Client */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Client
                </h3>
                <div className="flex items-center space-x-3">
                  {ticket.client ? (
                    <>
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {ticket.client.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {ticket.client.email}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      No client assigned
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {ticket.tags && ticket.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Tracking */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Time
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Estimated:</span>
                    <span className="text-white text-sm">
                      {ticket.estimatedHours
                        ? `${ticket.estimatedHours}h`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Actual:</span>
                    <span className="text-white text-sm">
                      {ticket.actualHours
                        ? `${ticket.actualHours}h`
                        : "Not tracked"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Dates
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Created:</span>
                    <span className="text-white text-sm">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Updated:</span>
                    <span className="text-white text-sm">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-sm">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-sm">
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
