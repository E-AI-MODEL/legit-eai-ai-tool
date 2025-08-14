
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro";
import Index from "./pages/Index";
import TaskDensity from "./pages/TaskDensity";
import PromptChecker from "./pages/PromptChecker";
import PromptGenerator from "./pages/PromptGenerator";
import SagaSecret from "./pages/SagaSecret";
import NotFound from "./pages/NotFound";
import { ViewModeProvider } from "@/context/view-mode";
import ViewModeSwitcher from "@/components/ViewModeSwitcher";
import { SecretAccess } from "@/components/SecretAccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ViewModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SecretAccess />
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/main" element={<Index />} />
            <Route path="/task-density" element={<TaskDensity />} />
            <Route path="/prompt-checker" element={<PromptChecker />} />
            <Route path="/prompt-generator" element={<PromptGenerator />} />
            <Route path="/saga-secret" element={<SagaSecret />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ViewModeSwitcher />
      </TooltipProvider>
    </ViewModeProvider>
  </QueryClientProvider>
);

export default App;
