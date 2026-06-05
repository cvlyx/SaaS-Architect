import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, TrendingUp, Users, Calendar, Activity, Key, Star } from "lucide-react";
import { motion } from "framer-motion";

export function HospitalityDashboard() {
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
          <Utensils className="h-8 w-8 text-amber-500" />
          Hospitality Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage bookings, guests, rooms, and restaurant operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Key className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +6% this week
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guests Today</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground mt-1">Checked in</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground mt-1">From guests</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings Tomorrow</CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground mt-1">Reservations</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
             <p className="text-sm text-muted-foreground mt-1">Manage hospitality operations</p>
             
             <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                 <div className="h-10 w-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Calendar className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-medium">New Booking</div>
                   <div className="text-xs text-muted-foreground">Reserve room</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                 <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Key className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-medium">Check In Guest</div>
                   <div className="text-xs text-muted-foreground">Process arrival</div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
             <p className="text-sm text-muted-foreground mt-1">Guest events</p>
             <div className="mt-6 space-y-4">
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <Activity className="h-4 w-4 text-green-500" />
                 <div>
                   <div className="text-sm font-medium">VIP guest checked in - Suite 405</div>
                   <div className="text-xs text-muted-foreground">15 minutes ago</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <Activity className="h-4 w-4 text-blue-500" />
                 <div>
                   <div className="text-sm font-medium">Restaurant reservation: 8 people at 7pm</div>
                   <div className="text-xs text-muted-foreground">Just booked</div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}