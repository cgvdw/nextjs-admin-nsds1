"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Switch } from "@/components/FormElements/switch";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

interface XeroIntegrationData {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string;
  isActive: boolean;
  webhookUrl?: string;
  description?: string;
}

export function XeroIntegrationForm() {
  const [formData, setFormData] = useState<XeroIntegrationData>({
    clientId: "",
    clientSecret: "",
    redirectUri: "",
    scopes: "offline_access accounting.transactions accounting.contacts",
    isActive: true,
    webhookUrl: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (field: keyof XeroIntegrationData, value: string | boolean) => {
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
          name: "Xero Integration",
          type: "XERO",
          apiKey: JSON.stringify({
            clientId: formData.clientId,
            clientSecret: formData.clientSecret,
            redirectUri: formData.redirectUri,
            scopes: formData.scopes,
            webhookUrl: formData.webhookUrl,
            description: formData.description,
          }),
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Xero integration saved successfully!"
        });
        // Reset form
        setFormData({
          clientId: "",
          clientSecret: "",
          redirectUri: "",
          scopes: "offline_access accounting.transactions accounting.contacts",
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

      <ShowcaseSection title="Xero Integration Configuration" className="space-y-5.5 !p-6.5">
        <InputGroup
          label="Xero Client ID"
          placeholder="Enter your Xero Client ID"
          type="text"
          value={formData.clientId}
          handleChange={(e) => handleInputChange("clientId", e.target.value)}
          required
        />

        <InputGroup
          label="Xero Client Secret"
          placeholder="Enter your Xero Client Secret"
          type="password"
          value={formData.clientSecret}
          handleChange={(e) => handleInputChange("clientSecret", e.target.value)}
          required
        />

        <InputGroup
          label="Redirect URI"
          placeholder="https://your-domain.com/auth/xero/callback"
          type="url"
          value={formData.redirectUri}
          handleChange={(e) => handleInputChange("redirectUri", e.target.value)}
          required
        />

        <InputGroup
          label="Scopes"
          placeholder="offline_access accounting.transactions accounting.contacts"
          type="text"
          value={formData.scopes}
          handleChange={(e) => handleInputChange("scopes", e.target.value)}
          required
        />

        <InputGroup
          label="Webhook URL (Optional)"
          placeholder="https://your-domain.com/webhooks/xero"
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
          {isLoading ? "Saving..." : "Save Xero Integration"}
        </button>
      </div>
    </form>
  );
} 