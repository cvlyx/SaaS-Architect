import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-provider";
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

const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
};

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/"><PublicLayout><Landing /></PublicLayout></Route>
      <Route path="/login"><PublicLayout><Login /></PublicLayout></Route>
      <Route path="/register"><PublicLayout><Register /></PublicLayout></Route>

      {/* Protected app */}
      <Route path="/app"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/app/organizations"><ProtectedRoute component={Organizations} /></Route>
      <Route path="/app/users"><ProtectedRoute component={UsersPage} /></Route>
      <Route path="/app/industry-packs"><ProtectedRoute component={IndustryPacksPage} /></Route>
      <Route path="/app/subscriptions"><ProtectedRoute component={SubscriptionsPage} /></Route>
      <Route path="/app/modules"><ProtectedRoute component={ModulesPage} /></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="org-os-theme">
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
