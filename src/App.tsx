
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
import PaymentMethodPage from "./pages/PaymentMethodPage";
import CreditCardCheckoutPage from "./pages/CreditCardCheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ChatPage from "./pages/ChatPage";
import ChatsListPage from "./pages/ChatsListPage";
import VideoCallPage from "./pages/VideoCallPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/encontrar-terapeutas" element={<FindTherapists />} />
            <Route path="/terapeuta/:id" element={<TherapistDetail />} />
            <Route path="/agendamento/:id" element={<BookingPage />} />
            <Route 
              path="/payment-method/:appointmentId" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <PaymentMethodPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout/:appointmentId/:method" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
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
            <Route 
              path="/editar-perfil-terapeuta" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <TherapistProfile isFirstTimeSetup={false} />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/selecionar-pagamento"
              element={
                <ProtectedRoute requireAuth={true}>
                  <PaymentMethodPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/checkout/credit-card"
              element={
                <ProtectedRoute requireAuth={true}>
                  <CreditCardCheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/payment-success"
              element={
                <ProtectedRoute requireAuth={true}>
                  <PaymentSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/chats"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ChatsListPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/chat/:chatId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/video-call/:roomId"
              element={
                <ProtectedRoute requireAuth={true}>
                  <VideoCallPage />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL \"*\" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
