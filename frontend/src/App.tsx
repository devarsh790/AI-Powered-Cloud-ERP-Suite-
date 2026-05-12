import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/common/Layout';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Finance/Invoices';
import { Ledger } from './pages/Finance/Ledger';
import { Payables } from './pages/Finance/Payables';
import { Receivables } from './pages/Finance/Receivables';
import { FinanceReports } from './pages/Finance/FinanceReports';
import { Employees } from './pages/HR/Employees';
import { Payroll } from './pages/HR/Payroll';
import { LeaveManagement } from './pages/HR/LeaveManagement';
import { Attendance } from './pages/HR/Attendance';
import { Inventory } from './pages/SupplyChain/Inventory';
import { PurchaseOrders } from './pages/SupplyChain/PurchaseOrders';
import { Vendors } from './pages/SupplyChain/Vendors';
import { ProjectsList } from './pages/Projects/ProjectsList';
import { ResourceAllocation } from './pages/Projects/ResourceAllocation';
import { Intelligence } from './pages/Intelligence/Intelligence';
import { AIForecasting } from './pages/AI/AIForecasting';
import { AuditCompliance } from './pages/Compliance/AuditCompliance';
import { IntegrationsApi } from './pages/Integrations/IntegrationsApi';
import { SettingsAdmin } from './pages/Settings/SettingsAdmin';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'card text-sm font-medium',
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="finance">
            <Route index element={<Navigate to="invoices" replace />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="payables" element={<Payables />} />
            <Route path="receivables" element={<Receivables />} />
            <Route path="reports" element={<FinanceReports />} />
          </Route>

          <Route path="hr">
            <Route index element={<Navigate to="employees" replace />} />
            <Route path="employees" element={<Employees />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>

          <Route path="supply-chain">
            <Route index element={<Navigate to="inventory" replace />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="vendors" element={<Vendors />} />
          </Route>

          <Route path="projects">
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<ProjectsList />} />
            <Route path="resources" element={<ResourceAllocation />} />
          </Route>

          <Route path="intelligence">
            <Route index element={<Intelligence />} />
            <Route path="forecast" element={<AIForecasting />} />
          </Route>

          <Route path="audit" element={<AuditCompliance />} />
          <Route path="integrations" element={<IntegrationsApi />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
