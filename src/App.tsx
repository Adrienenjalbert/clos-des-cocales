import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CommunePage from "./pages/CommunePage.tsx";
import SimulateurPret from "./pages/SimulateurPret.tsx";
import BudgetTotal from "./pages/BudgetTotal.tsx";
import Guide from "./pages/Guide.tsx";
import APropos from "./pages/APropos.tsx";
import Auth from "./pages/Auth.tsx";
import AdminLots from "./pages/AdminLots.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/programme" element={<Index />} />
          <Route path="/terrain-a-batir/:slug" element={<CommunePage />} />
          <Route path="/outils/simulateur-pret" element={<SimulateurPret />} />
          <Route path="/outils/budget-total" element={<BudgetTotal />} />
          <Route path="/guide/acheter-terrain-a-batir" element={<Guide />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/lots" element={<AdminLots />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
