import { HardHat, Building2, Users, FileWarning } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function ConstructionDashboard() {
  return (
    <IndustryDashboardShell
      icon={HardHat}
      title="Construction Dashboard"
      description="Track projects, safety, and site operations."
      slug="construction"
      stats={[
        { key: "totalProjects", label: "Projects", color: "orange", icon: Building2 },
        { key: "totalWorkers", label: "Workers", color: "yellow", icon: Users },
        { key: "totalSafetyReports", label: "Safety Reports", color: "blue", icon: FileWarning },
      ]}
    />
  );
}
