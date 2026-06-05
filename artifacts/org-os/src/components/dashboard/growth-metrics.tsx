import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetGrowthMetrics } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function GrowthMetrics() {
  const { data: metrics, isLoading } = useGetGrowthMetrics();

  if (isLoading) {
    return (
      <Card className="col-span-4 h-[400px]">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="flex items-end gap-2 h-[300px] p-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-1/6 bg-muted animate-pulse rounded-t-sm" style={{ height: `${[60, 80, 40, 90, 50, 70][i]}%` }}></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const mockMetrics = [
    { month: "Jan", newOrganizations: 12, revenue: 8500, activeUsers: 245 },
    { month: "Feb", newOrganizations: 18, revenue: 12000, activeUsers: 290 },
    { month: "Mar", newOrganizations: 24, revenue: 15600, activeUsers: 345 },
    { month: "Apr", newOrganizations: 31, revenue: 19200, activeUsers: 420 },
    { month: "May", newOrganizations: 38, revenue: 23800, activeUsers: 510 },
    { month: "Jun", newOrganizations: 42, revenue: 26500, activeUsers: 595 },
  ];
  
  const data = metrics || mockMetrics;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Growth Metrics</CardTitle>
        <CardDescription>New organizations and revenue over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" orientation="left" stroke="#00C49F" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#00B4D8" axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="newOrganizations" name="New Orgs" fill="#00C49F" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#00B4D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
