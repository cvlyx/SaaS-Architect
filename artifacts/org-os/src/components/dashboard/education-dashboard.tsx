import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, ClipboardList, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function EducationDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.organizationId || !token) return;
    fetch(`${API}/api/education/stats?organizationId=${user.organizationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d); })
      .finally(() => setLoading(false));
  }, [user?.organizationId, token]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const cards = [
    { label: "Active Students", value: stats?.totalStudents ?? 0, icon: Users, color: "yellow", href: "/app/education/students" },
    { label: "Teachers", value: stats?.totalTeachers ?? 0, icon: Users, color: "blue", href: "/app/education/teachers" },
    { label: "Classes", value: stats?.totalClasses ?? 0, icon: BookOpen, color: "purple", href: "/app/education/classes" },
    { label: "Enrollments", value: stats?.totalEnrollments ?? 0, icon: ClipboardList, color: "emerald", href: "#" },
  ];

  const colorMap: Record<string, string> = {
    yellow: "from-yellow-500/10 to-yellow-600/5 border-yellow-200 dark:border-yellow-800",
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800",
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-yellow-500" />
          Education Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage classes, students, grades, and academic operations.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link href={card.href}>
                <Card className={`bg-gradient-to-br ${colorMap[card.color]} cursor-pointer hover:shadow-md transition-shadow`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                    <card.icon className={`h-4 w-4 text-${card.color}-500`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Quick Links</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/app/education/students" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Users className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Manage Students</span>
            </Link>
            <Link href="/app/education/teachers" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Manage Teachers</span>
            </Link>
            <Link href="/app/education/classes" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Manage Classes</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">At a Glance</CardTitle></CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Students per Teacher</span>
                  <span className="font-bold">{stats.totalTeachers > 0 ? (stats.totalStudents / stats.totalTeachers).toFixed(1) : "—"}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Students per Class</span>
                  <span className="font-bold">{stats.totalClasses > 0 ? (stats.totalStudents / stats.totalClasses).toFixed(1) : "—"}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Enrollment Rate</span>
                  <span className="font-bold">{stats.totalStudents > 0 ? `${((stats.totalEnrollments / stats.totalStudents) * 100).toFixed(0)}%` : "—"}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet. Start by adding students and teachers.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}