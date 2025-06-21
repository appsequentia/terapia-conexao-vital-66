import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import FindTherapists from "./pages/FindTherapists";
import HowItWorks from "./pages/HowItWorks";
import ParaTerapeutas from "./pages/ParaTerapeutas";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ClientDashboard from "./pages/ClientDashboard";
import TherapistDashboard from "./pages/TherapistDashboard";
import TherapistProfile from "./pages/TherapistProfile";
import NotFound from "./pages/NotFound";
import TherapistDetail from "./pages/TherapistDetail";

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
            <Route path="/encontrar-terapeutas" element={<FindTherapists />} />
            <Route path="/terapeuta/:id" element={<TherapistDetail />} />
            <Route path="/como-funciona" element={<HowItWorks />} />
            <Route path="/para-terapeutas" element={<ParaTerapeutas />} />
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cadastro" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/esqueci-senha" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard-cliente" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard-terapeuta" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <TherapistDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/completar-cadastro-terapeuta" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <TherapistProfile isFirstTimeSetup={true} />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/perfil-terapeuta" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <TherapistProfile isFirstTimeSetup={false} />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
