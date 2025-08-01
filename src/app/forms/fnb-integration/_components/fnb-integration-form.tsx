"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Switch } from "@/components/FormElements/switch";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

interface FNBIntegrationData {
  clientId: string;
  clientSecret: string;
  apiKey: string;
  environment: "sandbox" | "production";
  isActive: boolean;
  webhookUrl?: string;
  description?: string;
}

export function FNBIntegrationForm() {
  const [formData, setFormData] = useState<FNBIntegrationData>({
    clientId: "",
    clientSecret: "",
    apiKey: "",
    environment: "sandbox",
    isActive: true,
    webhookUrl: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (field: keyof FNBIntegrationData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "FNB Integration",
          type: "FNB",
          apiKey: JSON.stringify({
            clientId: formData.clientId,
            clientSecret: formData.clientSecret,
            apiKey: formData.apiKey,
            environment: formData.environment,
            webhookUrl: formData.webhookUrl,
            description: formData.description,
          }),
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "FNB integration saved successfully!"
        });
        // Reset form
        setFormData({
          clientId: "",
          clientSecret: "",
          apiKey: "",
          environment: "sandbox",
          isActive: true,
          webhookUrl: "",
          description: "",
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to save integration"
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === "success" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <ShowcaseSection title="FNB Integration Configuration" className="space-y-5.5 !p-6.5">
        <InputGroup
          label="FNB Client ID"
          placeholder="Enter your FNB Client ID"
          type="text"
          value={formData.clientId}
          handleChange={(e) => handleInputChange("clientId", e.target.value)}
          required
        />

        <InputGroup
          label="FNB Client Secret"
          placeholder="Enter your FNB Client Secret"
          type="password"
          value={formData.clientSecret}
          handleChange={(e) => handleInputChange("clientSecret", e.target.value)}
          required
        />

        <InputGroup
          label="API Key"
          placeholder="Enter your FNB API Key"
          type="password"
          value={formData.apiKey}
          handleChange={(e) => handleInputChange("apiKey", e.target.value)}
          required
        />

        <div>
          <label className="text-sm font-medium text-dark-4 dark:text-dark-6 mb-2 block">
            Environment
          </label>
          <select
            value={formData.environment}
            onChange={(e) => handleInputChange("environment", e.target.value as "sandbox" | "production")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-dark dark:text-white"
            required
          >
            <option value="sandbox">Sandbox</option>
            <option value="production">Production</option>
          </select>
        </div>

        <InputGroup
          label="Webhook URL (Optional)"
          placeholder="https://your-domain.com/webhooks/fnb"
          type="url"
          value={formData.webhookUrl}
          handleChange={(e) => handleInputChange("webhookUrl", e.target.value)}
        />

        <InputGroup
          label="Description (Optional)"
          placeholder="Enter a description for this integration"
          type="text"
          value={formData.description}
          handleChange={(e) => handleInputChange("description", e.target.value)}
        />

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-4 dark:text-dark-6">
            Integration Active
          </label>
          <Switch
            checked={formData.isActive}
            onChange={(checked) => handleInputChange("isActive", checked)}
          />
        </div>
      </ShowcaseSection>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : "Save FNB Integration"}
        </button>
      </div>
    </form>
  );
} 