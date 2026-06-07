import { Scale, Users, FileText, Gavel } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function LegalDashboard() {
  return (
    <IndustryDashboardShell
      icon={Scale}
      title="Legal Dashboard"
      description="Track cases, documents, and clients."
      slug="legal"
      stats={[
        { key: "totalClients", label: "Clients", color: "pink", icon: Users },
        { key: "totalCases", label: "Cases", color: "blue", icon: Gavel },
        { key: "totalDocuments", label: "Documents", color: "amber", icon: FileText },
      ]}
    />
  );
}
