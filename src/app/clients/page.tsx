"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Mail, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  isInvited: boolean;
  createdAt: string;
}

export default function ClientsPage() {
  const { user, token } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    isInvited: false,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      setClients(data);
    } catch (error) {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create client");
      }

      // Reset form and close modal
      setNewClient({ name: "", email: "", isInvited: false });
      setShowCreateModal(false);

      // Refresh clients
      fetchClients();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create client"
      );
    }
  };

  if (!user || user.role !== "USER") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-[#B3B3B3] text-lg">Access denied</p>
          <p className="text-[#B3B3B3] text-sm mt-2">
            Only users can access this page
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
            <p className="text-[#B3B3B3]">Manage your client relationships</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Client</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
            <p className="text-[#EF4444]">{error}</p>
          </div>
        )}

        {/* Clients list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#B3B3B3] text-lg">No clients found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200"
            >
              Add your first client
            </button>
          </div>
        ) : (
          <div className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Name
                    </th>
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Email
                    </th>
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Status
                    </th>
                    <th className="text-left p-6 text-[#B3B3B3] font-medium">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr
                      key={client.id}
                      className={cn(
                        "border-b border-[#2A2A2A] hover:bg-[#2A2A2A]/50 transition-colors",
                        index % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#1E1E1E]"
                      )}
                    >
                      <td className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {client.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-[#B3B3B3]" />
                          <p className="text-[#B3B3B3]">{client.email}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            client.isInvited
                              ? "bg-[#22C55E] text-white"
                              : "bg-[#6B7280] text-white"
                          )}
                        >
                          {client.isInvited ? "Invited" : "Not Invited"}
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="text-[#B3B3B3] text-sm">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Client Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E1E1E] rounded-2xl p-8 max-w-md w-full border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Add New Client
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-[#B3B3B3] hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#B3B3B3] mb-2"
                  >
                    Client Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder-[#B3B3B3] focus:border-[#6366F1] focus:outline-none"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#B3B3B3] mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder-[#B3B3B3] focus:border-[#6366F1] focus:outline-none"
                    placeholder="Enter client email"
                    required
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    id="isInvited"
                    type="checkbox"
                    checked={newClient.isInvited}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        isInvited: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#6366F1] bg-[#2A2A2A] border-[#3A3A3A] rounded focus:ring-[#6366F1] focus:ring-2"
                  />
                  <label htmlFor="isInvited" className="text-sm text-[#B3B3B3]">
                    Send invitation email
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border border-[#3A3A3A] text-[#B3B3B3] rounded-lg hover:bg-[#2A2A2A] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200"
                  >
                    Create Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
