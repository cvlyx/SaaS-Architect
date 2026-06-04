import { PlatformSummaryStats } from "@/components/dashboard/platform-summary";
import { IndustryBreakdown } from "@/components/dashboard/industry-breakdown";
import { GrowthMetrics } from "@/components/dashboard/growth-metrics";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground">
          Monitor your SaaS platform's performance and growth.
        </p>
      </div>

      <PlatformSummaryStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <GrowthMetrics />
        <IndustryBreakdown />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
           <div className="p-6">
             <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
             <p className="text-sm text-muted-foreground mt-1">Manage platform operations</p>
             
             <div className="grid grid-cols-2 gap-4 mt-6">
               <a href="/app/organizations" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                 <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
                 </div>
                 <div>
                   <div className="font-medium">Organizations</div>
                   <div className="text-xs text-muted-foreground">Manage workspaces</div>
                 </div>
               </a>
               <a href="/app/users" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                 <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                 </div>
                 <div>
                   <div className="font-medium">Users</div>
                   <div className="text-xs text-muted-foreground">Manage platform users</div>
                 </div>
               </a>
               <a href="/app/subscriptions" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                 <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                 </div>
                 <div>
                   <div className="font-medium">Billing</div>
                   <div className="text-xs text-muted-foreground">Invoices and plans</div>
                 </div>
               </a>
               <a href="/app/industry-packs" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                 <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
                 </div>
                 <div>
                   <div className="font-medium">Industry Packs</div>
                   <div className="text-xs text-muted-foreground">Manage templates</div>
                 </div>
               </a>
             </div>
           </div>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}
