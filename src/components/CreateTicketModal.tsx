"use client";

import { useState, useEffect } from "react";
import { X, Plus, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  isInvited: boolean;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: { title: string; status: string; clientId?: string }) => void;
}

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
    status: "BACKLOG",
    clientId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInvitedClients();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".client-dropdown-container")) {
        setShowClientDropdown(false);
      }
    };

    if (showClientDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showClientDropdown]);

  const fetchInvitedClients = async () => {
    setIsLoadingClients(true);
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const allClients = await response.json();
        const invitedClients = allClients.filter(
          (client: Client) => client.isInvited
        );
        setClients(invitedClients);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      status: "BACKLOG",
      clientId: "",
    });
    setShowClientDropdown(false);
    onClose();
  };

  const selectedClient = clients.find(
    (client) => client.id === formData.clientId
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client (Invited Only)
            </label>
            <div className="relative client-dropdown-container">
              <button
                type="button"
                onClick={() => setShowClientDropdown(!showClientDropdown)}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-8 pr-4 py-2 text-left text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <User className="text-gray-400 w-4 h-4 mr-2" />
                  <span
                    className={selectedClient ? "text-white" : "text-gray-400"}
                  >
                    {selectedClient
                      ? selectedClient.name
                      : "Select an invited client..."}
                  </span>
                </div>
                <ChevronDown className="text-gray-400 w-4 h-4" />
              </button>

              {showClientDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {isLoadingClients ? (
                    <div className="p-3 text-gray-400 text-sm">
                      Loading clients...
                    </div>
                  ) : clients.length === 0 ? (
                    <div className="p-3 text-gray-400 text-sm">
                      No invited clients available
                    </div>
                  ) : (
                    clients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            clientId: client.id,
                          }));
                          setShowClientDropdown(false);
                        }}
                        className="w-full p-3 text-left text-white hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-b-0"
                      >
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-400">
                          {client.email}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
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
