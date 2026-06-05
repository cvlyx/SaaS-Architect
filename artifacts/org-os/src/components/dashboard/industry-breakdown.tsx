import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetIndustryBreakdown } from "@workspace/api-client-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ['#00C49F', '#00B4D8', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function IndustryBreakdown() {
  const { data: breakdown, isLoading } = useGetIndustryBreakdown();

  if (isLoading) {
    return (
      <Card className="col-span-3 h-[400px]">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="h-48 w-48 rounded-full bg-muted animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const mockBreakdown = [
    { industry: "Healthcare", count: 12, percentage: 29 },
    { industry: "Education", count: 10, percentage: 24 },
    { industry: "Technology", count: 8, percentage: 19 },
    { industry: "Finance", count: 6, percentage: 14 },
    { industry: "Retail", count: 4, percentage: 10 },
    { industry: "Other", count: 2, percentage: 5 },
  ];

  const data = breakdown || mockBreakdown;

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Industry Breakdown</CardTitle>
        <CardDescription>Distribution of organizations by industry</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="industry"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} Organizations`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
