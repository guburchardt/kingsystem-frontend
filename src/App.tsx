import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/Layout/AppLayout';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ClientsPage } from './pages/Clients/ClientsPage';
import { ClientFormPage } from './pages/Clients/ClientFormPage';
import { VehiclesPage } from './pages/Vehicles/VehiclesPage';
import { VehicleFormPage } from './pages/Vehicles/VehicleFormPage';
import { DriversPage } from './pages/Drivers/DriversPage';
import { DriverFormPage } from './pages/Drivers/DriverFormPage';
import { RentalsPage } from './pages/Rentals/RentalsPage';
import { RentalFormPage } from './pages/Rentals/RentalFormPage';
import { RentalContractPage } from './pages/Rentals/RentalContractPage';
import { CostsPage, CostFormPage } from './pages/Costs';
import { PaymentsPage } from './pages/Payments/PaymentsPage';
import { PaymentFormPage } from './pages/Payments/PaymentFormPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { FinanceiroPage } from './pages/Financeiro';
import { EmailsPage, EmailFormPage } from './pages/Emails';
import { ConsultoresPage, ConsultorFormPage } from './pages/Consultores';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticação..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute>
            <AppLayout>
              <ClientsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/clients/new" element={
          <ProtectedRoute>
            <AppLayout>
              <ClientFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/clients/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <ClientFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/vehicles" element={
          <ProtectedRoute>
            <AppLayout>
              <VehiclesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/vehicles/new" element={
          <ProtectedRoute>
            <AppLayout>
              <VehicleFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/vehicles/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <VehicleFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/drivers" element={
          <ProtectedRoute>
            <AppLayout>
              <DriversPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/drivers/new" element={
          <ProtectedRoute>
            <AppLayout>
              <DriverFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/drivers/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <DriverFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/rentals" element={
          <ProtectedRoute>
            <AppLayout>
              <RentalsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/rentals/new" element={
          <ProtectedRoute>
            <AppLayout>
              <RentalFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/rentals/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <RentalFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/rentals/:id/contract" element={
          <ProtectedRoute>
            <AppLayout>
              <RentalContractPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/costs" element={
          <ProtectedRoute>
            <AppLayout>
              <CostsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/costs/new" element={
          <ProtectedRoute>
            <AppLayout>
              <CostFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/costs/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <CostFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/emails" element={
          <ProtectedRoute>
            <AppLayout>
              <EmailsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/emails/new" element={
          <ProtectedRoute>
            <AppLayout>
              <EmailFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/emails/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <EmailFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/consultores" element={
          <ProtectedRoute>
            <AppLayout>
              <ConsultoresPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/consultores/new" element={
          <ProtectedRoute>
            <AppLayout>
              <ConsultorFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/consultores/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <ConsultorFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/payments/new" element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/payments/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/financeiro" element={
          <ProtectedRoute>
            <AppLayout>
              <FinanceiroPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
// Updated for Vercel deploy
