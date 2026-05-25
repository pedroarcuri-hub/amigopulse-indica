import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { RequireAuth, RequireAdmin } from "@/components/RequireAuth";
import { AppLayout } from "@/components/AppLayout";
import { Stub } from "@/pages/Stub";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import MinhasIndicacoes from "./pages/MinhasIndicacoes";
import NovaIndicacao from "./pages/NovaIndicacao";
import Ranking from "./pages/Ranking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />

            {/* App (colaborador) */}
            <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="nova-indicacao" element={<NovaIndicacao />} />
              <Route path="indicacoes" element={<MinhasIndicacoes />} />
              <Route path="ranking" element={<Ranking />} />
              <Route path="ganhos" element={<Stub title="Meus ganhos" description="Bônus liberados e a receber." />} />
              <Route path="regras" element={<Stub title="Regras do programa" />} />
              <Route path="ajuda" element={<Stub title="Central de ajuda" />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<RequireAdmin><AppLayout /></RequireAdmin>}>
              <Route index element={<Stub title="Visão geral (admin)" />} />
              <Route path="indicacoes" element={<Stub title="Indicações (admin)" />} />
              <Route path="ranking" element={<Ranking />} />
              <Route path="metricas" element={<Stub title="Métricas avançadas" />} />
              <Route path="pagamentos" element={<Stub title="Pagamentos" />} />
              <Route path="usuarios" element={<Stub title="Usuários" />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
