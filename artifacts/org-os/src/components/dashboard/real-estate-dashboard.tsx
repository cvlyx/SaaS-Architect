import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, TrendingUp, Users, Key, Activity, Building2, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export function RealEstateDashboard() {
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
          <Home className="h-8 w-8 text-rose-500" />
          Real Estate Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track properties, listings, showings, and transactions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border-rose-200 dark:border-rose-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Home className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">36</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +4 this week
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
              <Key className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">On duty</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Showings Today</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
             <p className="text-sm text-muted-foreground mt-1">Manage real estate operations</p>
             
             <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                 <div className="h-10 w-10 rounded bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Home className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-medium">Add Listing</div>
                   <div className="text-xs text-muted-foreground">New property</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                 <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Key className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-medium">Schedule Showing</div>
                   <div className="text-xs text-muted-foreground">Book tour</div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
             <p className="text-sm text-muted-foreground mt-1">Property events</p>
             <div className="mt-6 space-y-4">
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <Activity className="h-4 w-4 text-green-500" />
                 <div>
                   <div className="text-sm font-medium">Property sold: 123 Oak St - $450k</div>
                   <div className="text-xs text-muted-foreground">Just now</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <Activity className="h-4 w-4 text-blue-500" />
                 <div>
                   <div className="text-sm font-medium">New listing added: 456 Pine Ave</div>
                   <div className="text-xs text-muted-foreground">22 minutes ago</div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}