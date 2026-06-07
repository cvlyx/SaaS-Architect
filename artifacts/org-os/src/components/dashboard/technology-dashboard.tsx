import { Laptop, Monitor, CheckSquare, Users } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function TechnologyDashboard() {
  return (
    <IndustryDashboardShell
      icon={Laptop}
      title="Technology Dashboard"
      description="Monitor projects, tasks, and team performance."
      slug="technology"
      stats={[
        { key: "totalProjects", label: "Projects", color: "cyan", icon: Monitor },
        { key: "totalTasks", label: "Tasks", color: "purple", icon: CheckSquare },
        { key: "totalTeamMembers", label: "Team Members", color: "green", icon: Users },
      ]}
    />
  );
}
