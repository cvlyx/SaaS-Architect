import { Building2, Users, FileWarning, ClipboardList } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function GovernmentDashboard() {
  return (
    <IndustryDashboardShell
      icon={Building2}
      title="Government Dashboard"
      description="Manage citizens, permits, and service requests."
      slug="government"
      stats={[
        { key: "totalCitizens", label: "Citizens", color: "blue", icon: Users },
        { key: "totalPermits", label: "Permits", color: "amber", icon: FileWarning },
        { key: "totalRequests", label: "Service Requests", color: "green", icon: ClipboardList },
      ]}
    />
  );
}
