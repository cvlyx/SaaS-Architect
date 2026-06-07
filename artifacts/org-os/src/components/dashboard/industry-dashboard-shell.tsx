import { useIndustryStats } from "@/lib/use-industry-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const CHART_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#06b6d4", "#ec4899"];

const CARD_STYLES: Record<string, string> = {
  red: "bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200 dark:border-red-800",
  blue: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800",
  green: "bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800",
  amber: "bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800",
  purple: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800",
  teal: "bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-200 dark:border-teal-800",
  orange: "bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800",
  yellow: "bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-200 dark:border-yellow-800",
  pink: "bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-200 dark:border-pink-800",
  cyan: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-200 dark:border-cyan-800",
  emerald: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800",
  rose: "bg-gradient-to-br from-rose-500/10 to-rose-600/5 border-rose-200 dark:border-rose-800",
  indigo: "bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-200 dark:border-indigo-800",
};

const ICON_COLORS: Record<string, string> = {
  red: "text-red-500",
  blue: "text-blue-500",
  green: "text-green-500",
  amber: "text-amber-500",
  purple: "text-purple-500",
  teal: "text-teal-500",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  pink: "text-pink-500",
  cyan: "text-cyan-500",
  emerald: "text-emerald-500",
  rose: "text-rose-500",
  indigo: "text-indigo-500",
};

interface StatDef {
  key: string;
  label: string;
  color: string;
  icon: any;
}

interface Props {
  icon: any;
  title: string;
  description: string;
  slug: string;
  stats: StatDef[];
}

export function IndustryDashboardShell({ icon: Icon, title, description, slug, stats }: Props) {
  const { data, loading } = useIndustryStats(slug);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const chartData = stats.map((s, i) => ({
    name: s.label,
    value: data ? (data[s.key] ?? 0) : 0,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));
  const hasData = data && Object.values(data).some(v => v > 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Icon className="h-8 w-8" />
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div key={s.key} variants={itemVariants}>
                <Card className={CARD_STYLES[s.color] || "border"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                    <s.icon className={`h-4 w-4 ${ICON_COLORS[s.color] || ""}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.[s.key] ?? 0}</div>
                    {data && data[s.key] > 0 && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        Total records
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">Entity Distribution</CardTitle></CardHeader>
              <CardContent>
                {hasData ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground text-sm">No data yet. Add records to see charts.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Proportion</CardTitle></CardHeader>
              <CardContent>
                {hasData ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground text-sm">No data yet. Add records to see charts.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </motion.div>
  );
}
