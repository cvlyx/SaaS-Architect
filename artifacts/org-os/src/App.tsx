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
