import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, ClipboardList, TrendingUp, Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";

export function EducationDashboard() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +8% this semester
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Running</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86</div>
              <p className="text-xs text-muted-foreground mt-1">Current term</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
              <ClipboardList className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty On Duty</CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52</div>
              <p className="text-xs text-muted-foreground mt-1">Teaching today</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
             <p className="text-sm text-muted-foreground mt-1">Manage academic operations</p>
             
             <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                 <div className="h-10 w-10 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Calendar className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-medium">Create Assignment</div>
                   <div className="text-xs text-muted-foreground">Add new task</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                 <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Award className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-medium">Record Grade</div>
                   <div className="text-xs text-muted-foreground">Update student marks</div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
             <p className="text-sm text-muted-foreground mt-1">Academic events</p>
             <div className="mt-6 space-y-4">
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <div className="h-4 w-4 rounded-full bg-green-500" />
                 <div>
                   <div className="text-sm font-medium">Math midterm grades published</div>
                   <div className="text-xs text-muted-foreground">18 minutes ago</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <div className="h-4 w-4 rounded-full bg-blue-500" />
                 <div>
                   <div className="text-sm font-medium">New student enrolled - Emma L.</div>
                   <div className="text-xs text-muted-foreground">45 minutes ago</div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}