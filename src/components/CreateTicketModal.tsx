"use client";

import { useState } from "react";
import {
  X,
  Plus,
  User,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: any) => void;
}

const priorityOptions = [
  { value: "LOW", label: "Low", icon: CheckCircle, color: "text-green-400" },
  { value: "MEDIUM", label: "Medium", icon: Clock, color: "text-yellow-400" },
  { value: "HIGH", label: "High", icon: AlertCircle, color: "text-orange-400" },
  { value: "URGENT", label: "Urgent", icon: Star, color: "text-red-400" },
];

const statusOptions = [
  { value: "BACKLOG", label: "Backlog", color: "bg-gray-500" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500" },
  { value: "REVISIONS", label: "Revisions", color: "bg-yellow-500" },
  { value: "CLIENT_REVIEW", label: "Client Review", color: "bg-purple-500" },
  { value: "COMPLETE", label: "Complete", color: "bg-green-500" },
];

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "BACKLOG",
    assignee: "",
    client: "",
    estimatedHours: "",
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "BACKLOG",
      assignee: "",
      client: "",
      estimatedHours: "",
      tags: [],
    });
    setCurrentTag("");
    onClose();
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl z-10 flex items-center justify-between p-6 border-b border-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Create New Ticket
              </h2>
              <p className="text-sm text-gray-400">
                Add a new task to your project
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-3 hover:bg-gray-800/50 rounded-lg hover:scale-110 border border-gray-700/50 hover:border-gray-600/50"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ticket Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter ticket title..."
              className="w-full input-modern"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the task in detail..."
              rows={4}
              className="w-full input-modern resize-none"
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: option.value,
                        }))
                      }
                      className={cn(
                        "flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200",
                        formData.priority === option.value
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                          : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: option.value }))
                    }
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200",
                      formData.status === option.value
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300"
                    )}
                  >
                    <div
                      className={cn("w-3 h-3 rounded-full", option.color)}
                    ></div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignee and Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Assignee
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      assignee: e.target.value,
                    }))
                  }
                  placeholder="Assign to team member..."
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, client: e.target.value }))
                  }
                  placeholder="Client name..."
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Estimated Hours and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Hours
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedHours: e.target.value,
                    }))
                  }
                  placeholder="0"
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      placeholder="Add tag..."
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-indigo-300 hover:text-indigo-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-800/50">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className={cn(
                "btn-primary",
                (isSubmitting || !formData.title.trim()) &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Ticket</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
