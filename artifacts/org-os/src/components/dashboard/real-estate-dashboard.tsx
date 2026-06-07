import { Home, Building, Users, Key } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function RealEstateDashboard() {
  return (
    <IndustryDashboardShell
      icon={Home}
      title="Real Estate Dashboard"
      description="Track properties, clients, and leases."
      slug="real-estate"
      stats={[
        { key: "totalProperties", label: "Properties", color: "rose", icon: Building },
        { key: "totalClients", label: "Clients", color: "green", icon: Users },
        { key: "totalLeases", label: "Leases", color: "blue", icon: Key },
      ]}
    />
  );
}
