import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-provider";
import { AnimatePresence, motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/app-layout";

// Public pages
import Landing from "@/pages/public/landing";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

// App pages
import Dashboard from "@/pages/app/dashboard";
import Organizations from "@/pages/app/organizations";
import UsersPage from "@/pages/app/users";
import IndustryPacksPage from "@/pages/app/industry-packs";
import SubscriptionsPage from "@/pages/app/subscriptions";
import ModulesPage from "@/pages/app/modules";

// Education pages
import EducationStudents from "@/pages/app/education/students";
import EducationTeachers from "@/pages/app/education/teachers";
import EducationClasses from "@/pages/app/education/classes";

// Industry pages
import { HealthcarePatients, HealthcareStaff, HealthcareAppointments } from "@/pages/app/industry/healthcare";
import { ConstructionProjects, ConstructionWorkers, ConstructionSafetyReports } from "@/pages/app/industry/construction";
import { RetailProducts, RetailInventory, RetailCustomers } from "@/pages/app/industry/retail";
import { TechnologyProjects, TechnologyTasks, TechnologyTeamMembers } from "@/pages/app/industry/technology";
import { FinanceAccounts, FinanceTransactions, FinanceBudgets } from "@/pages/app/industry/finance";
import { NonprofitDonors, NonprofitDonations, NonprofitCampaigns } from "@/pages/app/industry/nonprofit";
import { LegalClients, LegalCases, LegalDocuments } from "@/pages/app/industry/legal";
import { ManufacturingProducts, ManufacturingProductionRuns, ManufacturingSuppliers } from "@/pages/app/industry/manufacturing";
import { RealEstateProperties, RealEstateClients, RealEstateLeases } from "@/pages/app/industry/realestate";
import { HospitalityRooms, HospitalityGuests, HospitalityBookings } from "@/pages/app/industry/hospitality";
import { TransportationVehicles, TransportationDrivers, TransportationShipments } from "@/pages/app/industry/transportation";
import { MediaArticles, MediaAssets, MediaCampaigns } from "@/pages/app/industry/media";
import { ConsultingClients, ConsultingConsultants, ConsultingEngagements } from "@/pages/app/industry/consulting";
import { GovernmentCitizens, GovernmentPermits, GovernmentServiceRequests } from "@/pages/app/industry/government";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.15, ease: "easeIn" as const } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  return (
    <AppLayout>
      <AnimatedPage>
        <Component />
      </AnimatedPage>
    </AppLayout>
  );
};

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        {/* Public */}
        <Route path="/"><PublicLayout><AnimatedPage><Landing /></AnimatedPage></PublicLayout></Route>
        <Route path="/login"><PublicLayout><AnimatedPage><Login /></AnimatedPage></PublicLayout></Route>
        <Route path="/register"><PublicLayout><AnimatedPage><Register /></AnimatedPage></PublicLayout></Route>

        {/* Protected app */}
        <Route path="/app"><ProtectedRoute component={Dashboard} /></Route>
        <Route path="/app/organizations"><ProtectedRoute component={Organizations} /></Route>
        <Route path="/app/users"><ProtectedRoute component={UsersPage} /></Route>
        <Route path="/app/industry-packs"><ProtectedRoute component={IndustryPacksPage} /></Route>
        <Route path="/app/subscriptions"><ProtectedRoute component={SubscriptionsPage} /></Route>
        <Route path="/app/modules"><ProtectedRoute component={ModulesPage} /></Route>

        {/* Education routes */}
        <Route path="/app/education/students"><ProtectedRoute component={EducationStudents} /></Route>
        <Route path="/app/education/teachers"><ProtectedRoute component={EducationTeachers} /></Route>
        <Route path="/app/education/classes"><ProtectedRoute component={EducationClasses} /></Route>

        {/* Healthcare routes */}
        <Route path="/app/healthcare/patients"><ProtectedRoute component={HealthcarePatients} /></Route>
        <Route path="/app/healthcare/staff"><ProtectedRoute component={HealthcareStaff} /></Route>
        <Route path="/app/healthcare/appointments"><ProtectedRoute component={HealthcareAppointments} /></Route>

        {/* Construction routes */}
        <Route path="/app/construction/projects"><ProtectedRoute component={ConstructionProjects} /></Route>
        <Route path="/app/construction/workers"><ProtectedRoute component={ConstructionWorkers} /></Route>
        <Route path="/app/construction/safety-reports"><ProtectedRoute component={ConstructionSafetyReports} /></Route>

        {/* Retail routes */}
        <Route path="/app/retail/products"><ProtectedRoute component={RetailProducts} /></Route>
        <Route path="/app/retail/inventory"><ProtectedRoute component={RetailInventory} /></Route>
        <Route path="/app/retail/customers"><ProtectedRoute component={RetailCustomers} /></Route>

        {/* Technology routes */}
        <Route path="/app/technology/projects"><ProtectedRoute component={TechnologyProjects} /></Route>
        <Route path="/app/technology/tasks"><ProtectedRoute component={TechnologyTasks} /></Route>
        <Route path="/app/technology/team-members"><ProtectedRoute component={TechnologyTeamMembers} /></Route>

        {/* Finance routes */}
        <Route path="/app/finance/accounts"><ProtectedRoute component={FinanceAccounts} /></Route>
        <Route path="/app/finance/transactions"><ProtectedRoute component={FinanceTransactions} /></Route>
        <Route path="/app/finance/budgets"><ProtectedRoute component={FinanceBudgets} /></Route>

        {/* Non-Profit routes */}
        <Route path="/app/non-profit/donors"><ProtectedRoute component={NonprofitDonors} /></Route>
        <Route path="/app/non-profit/donations"><ProtectedRoute component={NonprofitDonations} /></Route>
        <Route path="/app/non-profit/campaigns"><ProtectedRoute component={NonprofitCampaigns} /></Route>

        {/* Legal routes */}
        <Route path="/app/legal/clients"><ProtectedRoute component={LegalClients} /></Route>
        <Route path="/app/legal/cases"><ProtectedRoute component={LegalCases} /></Route>
        <Route path="/app/legal/documents"><ProtectedRoute component={LegalDocuments} /></Route>

        {/* Manufacturing routes */}
        <Route path="/app/manufacturing/products"><ProtectedRoute component={ManufacturingProducts} /></Route>
        <Route path="/app/manufacturing/production-runs"><ProtectedRoute component={ManufacturingProductionRuns} /></Route>
        <Route path="/app/manufacturing/suppliers"><ProtectedRoute component={ManufacturingSuppliers} /></Route>

        {/* Real Estate routes */}
        <Route path="/app/real-estate/properties"><ProtectedRoute component={RealEstateProperties} /></Route>
        <Route path="/app/real-estate/clients"><ProtectedRoute component={RealEstateClients} /></Route>
        <Route path="/app/real-estate/leases"><ProtectedRoute component={RealEstateLeases} /></Route>

        {/* Hospitality routes */}
        <Route path="/app/hospitality/rooms"><ProtectedRoute component={HospitalityRooms} /></Route>
        <Route path="/app/hospitality/guests"><ProtectedRoute component={HospitalityGuests} /></Route>
        <Route path="/app/hospitality/bookings"><ProtectedRoute component={HospitalityBookings} /></Route>

        {/* Transportation routes */}
        <Route path="/app/transportation/vehicles"><ProtectedRoute component={TransportationVehicles} /></Route>
        <Route path="/app/transportation/drivers"><ProtectedRoute component={TransportationDrivers} /></Route>
        <Route path="/app/transportation/shipments"><ProtectedRoute component={TransportationShipments} /></Route>

        {/* Media routes */}
        <Route path="/app/media/articles"><ProtectedRoute component={MediaArticles} /></Route>
        <Route path="/app/media/assets"><ProtectedRoute component={MediaAssets} /></Route>
        <Route path="/app/media/campaigns"><ProtectedRoute component={MediaCampaigns} /></Route>

        {/* Consulting routes */}
        <Route path="/app/consulting/clients"><ProtectedRoute component={ConsultingClients} /></Route>
        <Route path="/app/consulting/consultants"><ProtectedRoute component={ConsultingConsultants} /></Route>
        <Route path="/app/consulting/engagements"><ProtectedRoute component={ConsultingEngagements} /></Route>

        {/* Government routes */}
        <Route path="/app/government/citizens"><ProtectedRoute component={GovernmentCitizens} /></Route>
        <Route path="/app/government/permits"><ProtectedRoute component={GovernmentPermits} /></Route>
        <Route path="/app/government/service-requests"><ProtectedRoute component={GovernmentServiceRequests} /></Route>

        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="org-os-theme">
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
