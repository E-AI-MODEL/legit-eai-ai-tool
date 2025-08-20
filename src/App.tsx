
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro";
import Main from "./pages/Main";
import TaskDensity from "./pages/TaskDensity";
import PromptChecker from "./pages/PromptChecker";
import PromptGenerator from "./pages/PromptGenerator";
import Saga from "./pages/Saga";
import NotFound from "./pages/NotFound";
import { ViewModeProvider } from "@/context/view-mode";
import ViewModeSwitcher from "@/components/ViewModeSwitcher";
import PasswordProtection from "@/components/PasswordProtection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ViewModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/main" element={
              <PasswordProtection>
                <Main />
              </PasswordProtection>
            } />
            <Route path="/task-density" element={
              <PasswordProtection>
                <TaskDensity />
              </PasswordProtection>
            } />
            <Route path="/prompt-checker" element={
              <PasswordProtection>
                <PromptChecker />
              </PasswordProtection>
            } />
            <Route path="/prompt-generator" element={
              <PasswordProtection>
                <PromptGenerator />
              </PasswordProtection>
            } />
            <Route path="/lp-ai-x9k3m7" element={
              <PasswordProtection>
                <Saga />
              </PasswordProtection>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ViewModeSwitcher />
      </TooltipProvider>
    </ViewModeProvider>
  </QueryClientProvider>
);

export default App;
