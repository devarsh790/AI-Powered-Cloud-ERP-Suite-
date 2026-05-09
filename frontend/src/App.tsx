import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/common/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Ledger } from './pages/Finance/Ledger';
import { Payables } from './pages/Finance/Payables';
import { Receivables } from './pages/Finance/Receivables';
import { Employees } from './pages/HR/Employees';
import { Payroll } from './pages/HR/Payroll';
import { Inventory } from './pages/SupplyChain/Inventory';
import { PurchaseOrders } from './pages/SupplyChain/PurchaseOrders';
import { ProjectsList } from './pages/Projects/ProjectsList';
import { useAuthStore } from './store/authStore';

// Dummy components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="card h-64 flex flex-col items-center justify-center text-muted animate-fade-in">
    <h2 className="text-2xl font-bold text-main mb-2">{title}</h2>
    <p>Module implementation in progress</p>
  </div>
);

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass-panel text-sm font-medium',
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)',
          },
        }} 
      />
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="finance">
            <Route index element={<Navigate to="ledger" replace />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="payables" element={<Payables />} />
            <Route path="receivables" element={<Receivables />} />
            <Route path="reports" element={<Placeholder title="Finance Reports" />} />
          </Route>
          
          <Route path="hr">
            <Route index element={<Navigate to="employees" replace />} />
            <Route path="employees" element={<Employees />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="leave" element={<Placeholder title="Leave Management" />} />
            <Route path="attendance" element={<Placeholder title="Attendance" />} />
          </Route>
          
          <Route path="supply-chain">
            <Route index element={<Navigate to="inventory" replace />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="vendors" element={<Placeholder title="Vendors" />} />
          </Route>
          
          <Route path="projects">
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<ProjectsList />} />
            <Route path="resources" element={<Placeholder title="Resource Allocation" />} />
          </Route>
          
          <Route path="settings">
            <Route index element={<Placeholder title="Settings & Admin" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
