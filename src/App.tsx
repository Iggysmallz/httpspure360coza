import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Cleaning from "./pages/Cleaning";
import Removals from "./pages/Removals";
import Care from "./pages/Care";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ClientDashboard from "./pages/ClientDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import CompleteProfile from "./pages/CompleteProfile";
import PendingApproval from "./pages/PendingApproval";
import WorkWithUs from "./pages/WorkWithUs";
import ComingSoon from "./pages/ComingSoon";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/work-with-us" element={<WorkWithUs />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/services" element={<Services />} />
            
            {/* Client Routes */}
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/cleaning" element={<Cleaning />} />
            <Route path="/removals" element={<Removals />} />
            <Route path="/care" element={<Care />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />

            {/* Worker Routes */}
            <Route 
              path="/worker-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["worker"]} requireProfileComplete>
                  <WorkerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complete-profile" 
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <CompleteProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pending-approval" 
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <PendingApproval />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
