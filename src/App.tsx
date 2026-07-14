import React from 'react';
import { BrowserRouter as Router, useRoutes, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import { routes } from './routes';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="itsec-theme">
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <IntersectObserver />
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </Router>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
