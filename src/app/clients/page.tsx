"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Mail, User, X, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  isInvited: boolean;
  createdAt: string;
}

export default function ClientsPage() {
  const { user } = useAuth();
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
      const response = await fetch("/api/clients");

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
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create client");
      }

      setNewClient({ name: "", email: "", isInvited: false });
      setShowCreateModal(false);
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
          <p className="text-gray-400 text-lg">Access denied</p>
          <p className="text-gray-400 text-sm mt-2">
            Only users can access this page
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
            <p className="text-gray-400">Manage your client relationships</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Client</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg mb-2">No clients found</p>
            <p className="text-gray-500 text-sm mb-6">
              Get started by adding your first client
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Add your first client
            </button>
          </div>
        ) : (
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="text-left p-6 text-gray-400 font-medium">
                      Name
                    </th>
                    <th className="text-left p-6 text-gray-400 font-medium">
                      Email
                    </th>
                    <th className="text-left p-6 text-gray-400 font-medium">
                      Status
                    </th>
                    <th className="text-left p-6 text-gray-400 font-medium">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr
                      key={client.id}
                      className={cn(
                        "border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors",
                        index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-900/30"
                      )}
                    >
                      <td className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-300">{client.email}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center space-x-2">
                          {client.isInvited ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              client.isInvited
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                            )}
                          >
                            {client.isInvited ? "Invited" : "Not Invited"}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-gray-400 text-sm">
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

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />

            <div className="relative w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Add New Client
                    </h2>
                    <p className="text-sm text-gray-400">
                      Create a new client record
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-3 hover:bg-gray-800/50 rounded-lg hover:scale-110 border border-gray-700/50 hover:border-gray-600/50"
                  title="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
                    placeholder="Enter client name..."
                    className="w-full input-modern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                    placeholder="Enter client email..."
                    className="w-full input-modern"
                  />
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
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
                    className="w-4 h-4 text-indigo-500 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  <label htmlFor="isInvited" className="text-sm text-gray-300">
                    Send invitation email (allows client to log in)
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-800/50">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newClient.name.trim() || !newClient.email.trim()}
                    className={cn(
                      "btn-primary",
                      (!newClient.name.trim() || !newClient.email.trim()) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Create Client</span>
                    </div>
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
