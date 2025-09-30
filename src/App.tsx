import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page - No Terminal Wrapper */}
          <Route path="/" element={<Landing />} />
          
          {/* App Routes - With Terminal Wrapper */}
          <Route path="/app/*" element={
            <div className="min-h-screen bg-black p-6 flex items-center justify-center">
              <div className="terminal-window w-full max-w-7xl min-h-[90vh]">
                <div className="terminal-title-bar">
                  <div className="traffic-lights">
                    <div className="traffic-light red"></div>
                    <div className="traffic-light yellow"></div>
                    <div className="traffic-light green"></div>
                  </div>
                  <div className="flex-1 text-center text-xs text-terminal-text font-mono">
                    Pythoughts Terminal — zsh — 80×24
                  </div>
                </div>
                <div className="terminal-content">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/tasks" element={<Index />} />
                    <Route path="/flows" element={<Index />} />
                    <Route path="/calendar" element={<Index />} />
                    <Route path="/reports" element={<Index />} />
                    <Route path="/settings" element={<Index />} />
                  </Routes>
                </div>
              </div>
            </div>
          } />
          
          {/* Legacy Routes - Redirect to /app */}
          <Route path="/tasks" element={
            <div className="min-h-screen bg-black p-6 flex items-center justify-center">
              <div className="terminal-window w-full max-w-7xl min-h-[90vh]">
                <div className="terminal-title-bar">
                  <div className="traffic-lights">
                    <div className="traffic-light red"></div>
                    <div className="traffic-light yellow"></div>
                    <div className="traffic-light green"></div>
                  </div>
                  <div className="flex-1 text-center text-xs text-terminal-text font-mono">
                    Pythoughts Terminal — zsh — 80×24
                  </div>
                </div>
                <div className="terminal-content">
                  <Index />
                </div>
              </div>
            </div>
          } />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
