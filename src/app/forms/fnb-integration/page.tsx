import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FNBIntegrationForm } from "./_components/fnb-integration-form";
import { IntegrationsList } from "./_components/integrations-list";

export const metadata: Metadata = {
  title: "FNB Integration",
};

export default function FNBIntegrationPage() {
  return (
    <>
      <Breadcrumb pageName="FNB Integration" />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">
            FNB Integration Setup
          </h1>
          <p className="text-dark-4 dark:text-dark-6">
            Configure your FNB integration settings. This will store your credentials securely in the database.
          </p>
        </div>

        <FNBIntegrationForm />
        
        <IntegrationsList />
      </div>
    </>
  );
}
