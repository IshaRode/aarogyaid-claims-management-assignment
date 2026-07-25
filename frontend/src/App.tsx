import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthLayout, ProtectedLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { SubmitClaimPage } from './pages/patient/SubmitClaimPage';
import { ClaimDetailsPage } from './pages/patient/ClaimDetailsPage';
import { InsurerDashboard } from './pages/insurer/InsurerDashboard';
import { InsurerClaimsTable } from './pages/insurer/InsurerClaimsTable';
import { ReviewPage } from './pages/insurer/ReviewPage';
import { NotFoundPage, UnauthorizedPage } from './pages/ErrorPages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Patient */}
              <Route element={<ProtectedLayout allowedRole="patient" />}>
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/patient/submit" element={<SubmitClaimPage />} />
                <Route path="/patient/claims/:id" element={<ClaimDetailsPage />} />
              </Route>

              {/* Insurer */}
              <Route element={<ProtectedLayout allowedRole="insurer" />}>
                <Route path="/insurer" element={<InsurerDashboard />} />
                <Route path="/insurer/claims" element={<InsurerClaimsTable />} />
                <Route path="/insurer/review/:id" element={<ReviewPage />} />
              </Route>

              {/* Error pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>

          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: 'white' },
              },
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
