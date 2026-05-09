import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Briefcase,
  Box,
  Settings,
  LogOut,
  Bell,
  Search,
  Command as CmdIcon
} from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { CommandPalette } from './CommandPalette';
import { motion } from 'framer-motion';

export const Layout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Finance', path: '/finance', icon: Wallet },
    { name: 'HR & Payroll', path: '/hr', icon: Users },
    { name: 'Supply Chain', path: '/supply-chain', icon: Box },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const subNavs: Record<string, { name: string; path: string }[]> = {
    '/finance': [
      { name: 'General Ledger', path: '/finance/ledger' },
      { name: 'Accounts Payable', path: '/finance/payables' },
      { name: 'Accounts Receivable', path: '/finance/receivables' },
      { name: 'Reports', path: '/finance/reports' },
    ],
    '/hr': [
      { name: 'Employees', path: '/hr/employees' },
      { name: 'Leave Management', path: '/hr/leave' },
      { name: 'Attendance', path: '/hr/attendance' },
      { name: 'Payroll', path: '/hr/payroll' },
    ],
    '/supply-chain': [
      { name: 'Inventory', path: '/supply-chain/inventory' },
      { name: 'Purchase Orders', path: '/supply-chain/purchase-orders' },
      { name: 'Vendors', path: '/supply-chain/vendors' },
    ],
    '/projects': [
      { name: 'All Projects', path: '/projects/list' },
      { name: 'Resource Allocation', path: '/projects/resources' },
    ],
  };

  const currentModule = `/${location.pathname.split('/')[1]}`;
  const activeSubNav = subNavs[currentModule === '/' ? '' : currentModule];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.5rem', borderBottom: 'var(--glass-border)' }}>
          {/* Using a placeholder for a neon logo effect */}
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-neon)', boxShadow: 'var(--shadow-neon)' }}></div>
          <span className="text-neon" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '1px' }}>AMDOX</span>
        </div>

        <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: 'var(--glass-border)' }}>
          <div className="glass-card" style={{ padding: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="nav-link"
            style={{ width: '100%', color: 'var(--danger)' }}
          >
            <LogOut size={18} />
            DISCONNECT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-container">
        <header className="top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            >
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Query Nexus...</span>
              <kbd style={{ marginLeft: '0.5rem', fontFamily: 'monospace', fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', border: 'var(--glass-border)' }}>
                ⌘K
              </kbd>
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-icon" style={{ position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: 'var(--secondary-neon)', borderRadius: '50%', boxShadow: 'var(--shadow-magenta)' }}></span>
            </button>
          </div>
        </header>

        {activeSubNav && (
          <div style={{ background: 'rgba(5, 5, 10, 0.5)', backdropFilter: 'blur(10px)', borderBottom: 'var(--glass-border)', padding: '0 2.5rem', display: 'flex', gap: '2rem' }}>
            {activeSubNav.map((item) => {
              const isSubActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    padding: '1rem 0',
                    borderBottom: isSubActive ? '2px solid var(--primary-neon)' : '2px solid transparent',
                    color: isSubActive ? 'var(--primary-neon)' : 'var(--text-muted)',
                    textShadow: isSubActive ? '0 0 10px rgba(0,240,255,0.3)' : 'none',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        <main className="content-area">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      <CommandPalette />
      <AIAssistant />
    </div>
  );
};
