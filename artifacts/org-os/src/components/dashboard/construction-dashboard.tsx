import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, TrendingUp, Users, Clock, Building2, Activity, Truck, FileText } from "lucide-react";
import { motion } from "framer-motion";

export function ConstructionDashboard() {
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
          <HardHat className="h-8 w-8 text-orange-500" />
          Construction Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track projects, safety, materials, and vendor operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Building2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +2 this month
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Site Workers</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">Current shift</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Days</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground mt-1">No incidents</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deliveries Today</CardTitle>
              <Truck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Materials incoming</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
             <p className="text-sm text-muted-foreground mt-1">Manage construction operations</p>
             
             <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                 <div className="h-10 w-10 rounded bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <FileText className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-medium">Log Safety Check</div>
                   <div className="text-xs text-muted-foreground">Record inspection</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                 <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Truck className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-medium">Schedule Delivery</div>
                   <div className="text-xs text-muted-foreground">Book materials</div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
             <p className="text-sm text-muted-foreground mt-1">Site events</p>
             <div className="mt-6 space-y-4">
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <Activity className="h-4 w-4 text-green-500" />
                 <div>
                   <div className="text-sm font-medium">Foundation pour completed</div>
                   <div className="text-xs text-muted-foreground">32 minutes ago</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <Activity className="h-4 w-4 text-yellow-500" />
                 <div>
                   <div className="text-sm font-medium">Steel delivery arrived</div>
                   <div className="text-xs text-muted-foreground">2 hours ago</div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}