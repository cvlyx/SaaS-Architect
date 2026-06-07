import { Briefcase, Users, UserCheck, CreditCard } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function ConsultingDashboard() {
  return (
    <IndustryDashboardShell
      icon={Briefcase}
      title="Consulting Dashboard"
      description="Track clients, consultants, and engagements."
      slug="consulting"
      stats={[
        { key: "totalClients", label: "Clients", color: "blue", icon: Users },
        { key: "totalConsultants", label: "Consultants", color: "indigo", icon: UserCheck },
        { key: "totalEngagements", label: "Engagements", color: "green", icon: CreditCard },
      ]}
    />
  );
}
