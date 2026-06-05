import { useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, ArrowUpCircle, ArrowDownCircle, XCircle, CreditCard } from "lucide-react";

type ActivityItemType = "signup" | "subscription" | "upgrade" | "downgrade" | "cancellation";

export function RecentActivity() {
  const { data: activity, isLoading } = useGetRecentActivity();

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockActivity = [
    { 
      id: 1, 
      type: "signup" as ActivityItemType, 
      description: "joined the platform", 
      organizationName: "Acme Healthcare", 
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() 
    },
    { 
      id: 2, 
      type: "subscription" as ActivityItemType, 
      description: "subscribed to Pro plan", 
      organizationName: "Bright Future School", 
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() 
    },
    { 
      id: 3, 
      type: "upgrade" as ActivityItemType, 
      description: "upgraded to Enterprise", 
      organizationName: "Innovate Tech", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() 
    },
    { 
      id: 4, 
      type: "signup" as ActivityItemType, 
      description: "started free trial", 
      organizationName: "Metro Retail", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() 
    },
    { 
      id: 5, 
      type: "subscription" as ActivityItemType, 
      description: "renewed subscription", 
      organizationName: "City Finance", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() 
    },
  ];

  const data = activity || mockActivity;

  const getIcon = (type: ActivityItemType) => {
    switch (type) {
      case 'signup': return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case 'upgrade': return <ArrowUpCircle className="h-4 w-4 text-blue-500" />;
      case 'downgrade': return <ArrowDownCircle className="h-4 w-4 text-amber-500" />;
      case 'cancellation': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'subscription': return <CreditCard className="h-4 w-4 text-indigo-500" />;
      default: return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest platform events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="mt-0.5 rounded-full bg-muted p-2 flex items-center justify-center">
                {getIcon(item.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {item.organizationName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {(!data || data.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
