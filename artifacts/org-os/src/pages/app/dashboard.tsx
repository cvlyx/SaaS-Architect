import { PlatformSummaryStats } from "@/components/dashboard/platform-summary";
import { GrowthMetrics } from "@/components/dashboard/growth-metrics";
import { IndustryBreakdown } from "@/components/dashboard/industry-breakdown";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { HealthcareDashboard } from "@/components/dashboard/healthcare-dashboard";
import { TechnologyDashboard } from "@/components/dashboard/technology-dashboard";
import { ConstructionDashboard } from "@/components/dashboard/construction-dashboard";
import { EducationDashboard } from "@/components/dashboard/education-dashboard";
import { RetailDashboard } from "@/components/dashboard/retail-dashboard";
import { FinanceDashboard } from "@/components/dashboard/finance-dashboard";
import { NonProfitDashboard } from "@/components/dashboard/non-profit-dashboard";
import { LegalDashboard } from "@/components/dashboard/legal-dashboard";
import { ManufacturingDashboard } from "@/components/dashboard/manufacturing-dashboard";
import { RealEstateDashboard } from "@/components/dashboard/real-estate-dashboard";
import { HospitalityDashboard } from "@/components/dashboard/hospitality-dashboard";
import { TransportationDashboard } from "@/components/dashboard/transportation-dashboard";
import { MediaDashboard } from "@/components/dashboard/media-dashboard";
import { ConsultingDashboard } from "@/components/dashboard/consulting-dashboard";
import { GovernmentDashboard } from "@/components/dashboard/government-dashboard";
import { useAuth } from "@/lib/auth-provider";

const INDUSTRY_PACK_SLUGS: Record<number, string> = {
  1: "healthcare",
  2: "construction",
  3: "retail",
  4: "education",
  5: "technology",
  6: "finance",
  19: "non-profit",
  20: "legal",
  23: "manufacturing",
  24: "real-estate",
  25: "hospitality",
  26: "transportation",
  27: "media",
  28: "consulting",
  29: "government",
};

export default function Dashboard() {
  const { user } = useAuth();
  const userIndustry = user?.industryPackId ? INDUSTRY_PACK_SLUGS[user.industryPackId] : null;

  const renderDashboard = () => {
    // Super admins see platform overview, regular users see their industry dashboard
    if (user?.role === "super_admin") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
            <p className="text-muted-foreground">
              Monitor your SaaS platform's performance and growth.
            </p>
          </div>

          <PlatformSummaryStats />
          <div className="grid gap-6 lg:grid-cols-2">
            <GrowthMetrics />
            <IndustryBreakdown />
          </div>
          <RecentActivity />
        </div>
      );
    }

    switch (userIndustry) {
      case "healthcare":
        return <HealthcareDashboard />;
      case "technology":
        return <TechnologyDashboard />;
      case "construction":
        return <ConstructionDashboard />;
      case "education":
        return <EducationDashboard />;
      case "retail":
        return <RetailDashboard />;
      case "finance":
        return <FinanceDashboard />;
      case "non-profit":
        return <NonProfitDashboard />;
      case "legal":
        return <LegalDashboard />;
      case "manufacturing":
        return <ManufacturingDashboard />;
      case "real-estate":
        return <RealEstateDashboard />;
      case "hospitality":
        return <HospitalityDashboard />;
      case "transportation":
        return <TransportationDashboard />;
      case "media":
        return <MediaDashboard />;
      case "consulting":
        return <ConsultingDashboard />;
      case "government":
        return <GovernmentDashboard />;
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
              <p className="text-muted-foreground">
                Your dashboard is ready.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderDashboard()}
    </div>
  );
}
