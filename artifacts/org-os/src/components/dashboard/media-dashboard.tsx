import { Newspaper, FileText, Package, Megaphone } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function MediaDashboard() {
  return (
    <IndustryDashboardShell
      icon={Newspaper}
      title="Media Dashboard"
      description="Manage articles, assets, and campaigns."
      slug="media"
      stats={[
        { key: "totalArticles", label: "Articles", color: "red", icon: FileText },
        { key: "totalAssets", label: "Assets", color: "blue", icon: Package },
        { key: "totalCampaigns", label: "Campaigns", color: "purple", icon: Megaphone },
      ]}
    />
  );
}
