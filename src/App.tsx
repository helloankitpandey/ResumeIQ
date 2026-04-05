/**
 * Root Application Component
 *
 * Sets up the global provider tree in the correct order:
 * 1. ThemeProvider  – light / dark mode via next-themes
 * 2. QueryClient   – TanStack React Query for server-state caching
 * 3. AuthProvider   – session & profile management
 * 4. TooltipProvider, Toasters – UI feedback layers
 * 5. BrowserRouter  – client-side routing
 *
 * All page routes are declared here. The catch-all "*" route must
 * always remain last so custom routes take priority.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Analyzer from "./pages/Analyzer";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy"; // Privacy Policy page
import TermsOfService from "./pages/TermsOfService"; // Terms of Service page
import NotFound from "./pages/NotFound";

/** Shared query client — keeps cached data across page navigations */
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <div>
      <Helmet>
        <meta name="google-site-verification" content="Ms_-THl9Ds2tw0ydvoWgeNLmYeKd-SUElokR1Q6pfRE" />
      </Helmet>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/builder" element={
                <ProtectedRoute>
                  <Builder />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={
                <ProtectedRoute>
                  <Pricing />
                </ProtectedRoute>
              } />
              <Route path="/analyzer" element={
                <ProtectedRoute>
                  <Analyzer />
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
    </ThemeProvider>
      </div>
    </HelmetProvider>
);

export default App;
