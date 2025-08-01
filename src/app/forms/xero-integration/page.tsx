import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { XeroIntegrationForm } from "./_components/xero-integration-form";
import { IntegrationsList } from "./_components/integrations-list";

export const metadata: Metadata = {
  title: "Xero Integration",
};

export default function XeroIntegrationPage() {
  return (
    <>
      <Breadcrumb pageName="Xero Integration" />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">
            Xero Integration Setup
          </h1>
          <p className="text-dark-4 dark:text-dark-6">
            Configure your Xero integration settings. This will store your credentials securely in the database.
          </p>
        </div>

        <XeroIntegrationForm />
        
        <IntegrationsList />
      </div>
    </>
  );
}
