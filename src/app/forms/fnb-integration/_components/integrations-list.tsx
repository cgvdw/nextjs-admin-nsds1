"use client";

import { useEffect, useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

interface Integration {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function IntegrationsList() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch("/api/integrations");
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data);
      } else {
        setError("Failed to fetch integrations");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/integrations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        // Update local state
        setIntegrations(prev =>
          prev.map(integration =>
            integration.id === id
              ? { ...integration, isActive: !currentStatus }
              : integration
          )
        );
      }
    } catch (error) {
      console.error("Failed to update integration status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this integration?")) {
      return;
    }

    try {
      const response = await fetch(`/api/integrations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setIntegrations(prev => prev.filter(integration => integration.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete integration");
    }
  };

  const handleEdit = (integration: Integration) => {
    // For now, just show an alert with the integration details
    // In a real app, you'd open a modal or navigate to an edit page
    alert(`Edit integration: ${integration.name} (${integration.type})`);
  };

  if (isLoading) {
    return (
      <ShowcaseSection title="Existing Integrations" className="!p-6.5">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-dark-4 dark:text-dark-6">Loading integrations...</p>
        </div>
      </ShowcaseSection>
    );
  }

  if (error) {
    return (
      <ShowcaseSection title="Existing Integrations" className="!p-6.5">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </ShowcaseSection>
    );
  }

  return (
    <ShowcaseSection title="Existing Integrations" className="!p-6.5">
      {integrations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-dark-4 dark:text-dark-6">No integrations found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-dark dark:text-white text-lg">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-dark-4 dark:text-dark-6">
                    Type: {integration.type}
                  </p>
                  <p className="text-xs text-dark-4 dark:text-dark-6 mt-1">
                    Created: {new Date(integration.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ml-2 ${
                    integration.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {integration.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(integration)}
                    className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(integration.id)}
                    className="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => handleToggleActive(integration.id, integration.isActive)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors ${
                    integration.isActive
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {integration.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ShowcaseSection>
  );
} 