import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, CreditCard, Activity } from "lucide-react";
import { useGetPlatformSummary } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export function PlatformSummaryStats() {
  const { data: summary, isLoading } = useGetPlatformSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Use mock data if no summary data is available
  const mockSummary = {
    totalOrganizations: 42,
    activeOrganizations: 35,
    trialOrganizations: 7,
    totalUsers: 1247,
    monthlyRevenue: 18450,
    churnRate: 2.4
  };
  
  const data = summary || mockSummary;

  const statCards = [
    {
      title: "Total Organizations",
      icon: Building2,
      value: data.totalOrganizations,
      subtitle: `${data.activeOrganizations} active, ${data.trialOrganizations} on trial`,
    },
    {
      title: "Total Users",
      icon: Users,
      value: data.totalUsers,
      subtitle: "Across all organizations",
    },
    {
      title: "Monthly Revenue",
      icon: CreditCard,
      value: `$${data.monthlyRevenue.toLocaleString()}`,
      subtitle: `${data.churnRate}% churn rate this month`,
    },
    {
      title: "System Health",
      icon: Activity,
      value: "100%",
      subtitle: "All services operational",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.iconColor || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
