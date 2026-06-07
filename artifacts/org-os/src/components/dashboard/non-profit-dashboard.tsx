import { Heart, Users, Gift, Megaphone } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function NonProfitDashboard() {
  return (
    <IndustryDashboardShell
      icon={Heart}
      title="Non-Profit Dashboard"
      description="Manage donors, donations, and campaigns."
      slug="non-profit"
      stats={[
        { key: "totalDonors", label: "Donors", color: "purple", icon: Users },
        { key: "totalDonations", label: "Donations", color: "pink", icon: Gift },
        { key: "totalCampaigns", label: "Campaigns", color: "blue", icon: Megaphone },
      ]}
    />
  );
}
