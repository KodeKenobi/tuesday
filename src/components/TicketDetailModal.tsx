"use client";

import { useState } from "react";
import {
  X,
  Edit,
  CheckCircle,
  Clock as ClockIcon,
  Zap,
  AlertCircle,
  Eye,
  Building,
  FileText,
} from "lucide-react";


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

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (ticketId: string, newStatus: string) => void;
  onDelete?: (ticketId: string) => void;
  onUpdate?: (ticketId: string, updates: Partial<Ticket>) => void;
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

export default function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  onUpdate,
}: TicketDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Ticket>>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !ticket) return null;

  
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(ticket.id, newStatus);
  };

  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this ticket?")) {
      onDelete(ticket.id);
      onClose();
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({});
    } else {
      setEditData({
        title: ticket.title,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    setIsSaving(true);
    try {
      await onUpdate(ticket.id, editData);
      setIsEditing(false);
      setEditData({});
    } catch (error) {
      console.error("Failed to update ticket:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title || ticket.title}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="text-xl font-bold text-white bg-transparent border-b border-gray-600 focus:border-indigo-500 focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-xl font-bold text-white line-clamp-1">
                  {ticket.title}
                </h2>
              )}
              <p className="text-sm text-gray-400">
                Created by {ticket.creator.name} •{" "}
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleEditToggle}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
              title={isEditing ? "Cancel edit" : "Edit ticket"}
            >
              <Edit className="w-4 h-4" />
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="text-green-400 hover:text-green-300 transition-colors p-2 hover:bg-green-500/10 rounded-lg disabled:opacity-50"
                title="Save changes"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                title="Delete ticket"
              >
                <X className="w-4 h-4" />
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

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
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
            </div>

            <div className="space-y-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
