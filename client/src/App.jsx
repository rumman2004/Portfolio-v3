import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { MascotProvider } from './context/MascotContext';
import MascotCompanion from './components/features/public/MascotCompanion';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <MascotProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <MascotCompanion />
            <AppRoutes />
          </MascotProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
