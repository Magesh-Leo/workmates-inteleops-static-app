import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tickets from "@/pages/tickets";
import Automation from "@/pages/automation";
import Integrations from "@/pages/integrations";
import Platforms from "@/pages/platforms";
import Accounts from "@/pages/accounts";
import Users from "@/pages/users";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import IntegrationPage from "./pages/notifications";
import LoginPage from "./pages/login";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NotificationPage from "./pages/notifications";

function Layout() {
  const { token } = useAuth();

  if (!token) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <Switch>
            <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
            <Route path="/tickets" component={() => <ProtectedRoute component={Tickets} />} />
            <Route path="/automation" component={() => <ProtectedRoute component={Automation} />} />
            <Route path="/integrations" component={() => <ProtectedRoute component={Integrations} />} />
            <Route path="/platforms" component={() => <ProtectedRoute component={Platforms} />} />
            <Route path="/notifications" component={() => <ProtectedRoute component={NotificationPage} />} />
            <Route path="/accounts" component={() => <ProtectedRoute component={Accounts} />} />
            <Route path="/users" component={() => <ProtectedRoute component={Users} />} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* ✅ wrap the whole app in AuthProvider */}
        <AuthProvider>
          <Switch>
            {/* Public route */}
            <Route path="/" component={LoginPage} />

            {/* Protected layout */}
            <Route path="/:rest*" component={Layout} />

            {/* Catch all */}
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
