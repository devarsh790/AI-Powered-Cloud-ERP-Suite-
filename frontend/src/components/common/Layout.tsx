import { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  Menu,
  Cpu,
  Activity,
  ChevronDown,
  BarChart3,
  ShieldCheck,
  Webhook,
} from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { CommandPalette, openCommandPalette } from './CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const WORKSPACES = ['Production', 'Staging', 'Sandbox'] as const;

export const Layout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [activeWs, setActiveWs] = useState<string>(WORKSPACES[0]);
  const [paletteModKey, setPaletteModKey] = useState('Ctrl');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ _id: string; title: string; message: string; isRead?: boolean }[]>([]);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const isApple =
      typeof navigator !== 'undefined' &&
      (/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.platform === 'MacIntel');
    setPaletteModKey(isApple ? '⌘' : 'Ctrl');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette shortcut (already handled by CommandPalette component)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        return;
      }

      // Refresh dashboard shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === 'r' && location.pathname === '/dashboard') {
        e.preventDefault();
        toast.success('Refreshing dashboard...');
        window.location.reload();
        return;
      }

      // Escape to close dropdowns and modals
      if (e.key === 'Escape') {
        if (workspaceOpen) setWorkspaceOpen(false);
        if (notifOpen) setNotifOpen(false);
        if (mobileNavOpen) setMobileNavOpen(false);
      }

      // Navigation shortcuts
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            window.location.href = '/dashboard';
            break;
          case '2':
            e.preventDefault();
            window.location.href = '/dashboard/finance';
            break;
          case '3':
            e.preventDefault();
            window.location.href = '/dashboard/hr';
            break;
          case '4':
            e.preventDefault();
            window.location.href = '/dashboard/supply-chain';
            break;
          case '5':
            e.preventDefault();
            window.location.href = '/dashboard/projects';
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [workspaceOpen, notifOpen, mobileNavOpen, location.pathname]);

  useEffect(() => {
    if (!workspaceOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setWorkspaceOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [workspaceOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [notifOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.data?.notifications || []);
      } catch {
        /* offline / demo */
      }
    };
    load();
  }, [location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isNarrow) setMobileNavOpen(false);
  }, [isNarrow]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Finance', path: '/dashboard/finance', icon: Wallet },
    { name: 'HR & Payroll', path: '/dashboard/hr', icon: Users },
    { name: 'Supply Chain', path: '/dashboard/supply-chain', icon: Box },
    { name: 'Projects', path: '/dashboard/projects', icon: Briefcase },
    { name: 'Intelligence', path: '/dashboard/intelligence', icon: BarChart3 },
    { name: 'Audit', path: '/dashboard/audit', icon: ShieldCheck },
    { name: 'Integrations', path: '/dashboard/integrations', icon: Webhook },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const sidebarWidth = isNarrow ? 280 : isSidebarCollapsed ? 80 : 280;

  return (
    <div className="app-layout">
      {isNarrow && (
        <button
          type="button"
          className={`sidebar-backdrop${mobileNavOpen ? ' is-open' : ''}`}
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <motion.aside
        className={`sidebar${isNarrow ? ' mobile-drawer' : ''}${isNarrow && !mobileNavOpen ? ' closed' : ''}`}
        initial={false}
        animate={{
          width: isNarrow ? 280 : sidebarWidth,
          x: isNarrow && !mobileNavOpen ? -320 : 0,
        }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={isNarrow ? { position: 'fixed', zIndex: 50 } : undefined}
      >
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed && !isNarrow ? 'center' : 'space-between',
            padding: '0 1.25rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          {(!isSidebarCollapsed || isNarrow) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{ height: 40 }}>
                <img
                  src="/logo.jfif"
                  alt="Amdox Logo"
                  style={{
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 8px rgba(230, 74, 25, 0.1))',
                  }}
                />
              </div>
            </motion.div>
          )}
          <button
            type="button"
            onClick={() => {
              if (isNarrow) setMobileNavOpen(false);
              else setSidebarCollapsed(!isSidebarCollapsed);
            }}
            className="btn-icon"
            style={{ background: 'transparent', border: 'none', width: 36, height: 36 }}
            aria-label={isNarrow ? 'Close sidebar' : 'Toggle sidebar'}
          >
            {isNarrow ? <ChevronLeft size={20} /> : isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.25rem 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{ justifyContent: isSidebarCollapsed && !isNarrow ? 'center' : 'flex-start' }}
              >
                <item.icon size={20} style={{ minWidth: 20 }} />
                {(!isSidebarCollapsed || isNarrow) && (
                  <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          {(!isSidebarCollapsed || isNarrow) && (
            <div
              className="card enterprise-card-static"
              style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {user?.firstName?.charAt(0)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{user?.role}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="nav-link"
            style={{
              margin: 0,
              color: 'var(--danger)',
              width: '100%',
              justifyContent: isSidebarCollapsed && !isNarrow ? 'center' : 'flex-start',
            }}
          >
            <LogOut size={20} />
            {(!isSidebarCollapsed || isNarrow) && <span>Sign out</span>}
          </button>
        </div>
      </motion.aside>

      <div className="main-container" style={{ minWidth: 0 }}>
        <header className="top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            {isNarrow && (
              <button
                type="button"
                className="btn-icon"
                aria-label="Open navigation"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu size={20} />
              </button>
            )}
            <div className="search-field-wrap">
              <Search
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
                size={16}
              />
              <input
                type="search"
                className="input"
                placeholder="Search or jump…"
                readOnly
                onFocus={() => openCommandPalette()}
                onClick={() => openCommandPalette()}
                style={{ paddingLeft: '2.75rem', paddingRight: '4.75rem', cursor: 'pointer' }}
                aria-label="Open command palette"
              />
              <span className="search-kbd-hint" aria-hidden>
                <span className="kbd-group">
                  <kbd className="kbd">{paletteModKey}</kbd>
                  <kbd className="kbd">K</kbd>
                </span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <div style={{ position: 'relative' }} ref={workspaceRef}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.8125rem',
                  gap: 6,
                }}
                onClick={() => setWorkspaceOpen((o) => !o)}
                aria-expanded={workspaceOpen}
                aria-haspopup="listbox"
              >
                <span className="label-overline" style={{ fontSize: '0.6rem', opacity: 0.85 }}>
                  Workspace
                </span>
                <span style={{ fontWeight: 700 }}>{activeWs}</span>
                <ChevronDown size={14} color="var(--text-dim)" />
              </button>
              <AnimatePresence>
                {workspaceOpen && (
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: 8,
                      minWidth: 200,
                      padding: '0.35rem',
                      borderRadius: 12,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 60,
                      listStyle: 'none',
                    }}
                  >
                    {WORKSPACES.map((ws) => (
                      <li key={ws}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={ws === activeWs}
                          onClick={() => {
                            setActiveWs(ws);
                            setWorkspaceOpen(false);
                          }}
                          className="btn-ghost"
                          style={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            padding: '0.55rem 0.75rem',
                            borderRadius: 8,
                            fontSize: '0.875rem',
                            fontWeight: ws === activeWs ? 600 : 500,
                            color: ws === activeWs ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}
                        >
                          {ws}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                type="button"
                className="btn-icon"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                style={{ position: 'relative' }}
                onClick={() => setNotifOpen((o) => !o)}
              >
                <Bell size={20} />
                {notifications.some((n) => !n.isRead) && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 8,
                      height: 8,
                      background: 'var(--primary)',
                      borderRadius: '50%',
                      border: '2px solid var(--bg-surface)',
                    }}
                  />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: 10,
                      width: 340,
                      maxHeight: 360,
                      overflowY: 'auto',
                      padding: '0.5rem',
                      borderRadius: 14,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 70,
                    }}
                  >
                    <p className="label-overline" style={{ padding: '0.5rem 0.75rem' }}>
                      In-app (F-10)
                    </p>
                    {notifications.length === 0 ? (
                      <p className="text-muted text-sm" style={{ padding: '1rem' }}>
                        No notifications
                      </p>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <button
                          key={n._id}
                          type="button"
                          className="btn-ghost"
                          style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            padding: '0.65rem 0.75rem',
                            borderRadius: 10,
                            opacity: n.isRead ? 0.85 : 1,
                          }}
                          onClick={async () => {
                            try {
                              await api.put(`/notifications/${n._id}/read`);
                              setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)));
                            } catch {
                              toast.error('Could not mark read');
                            }
                          }}
                        >
                          <strong style={{ display: 'block', fontSize: '0.8125rem' }}>{n.title}</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {n.message}
                          </span>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ height: 24, width: 1, background: 'var(--border-light)' }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.45rem 0.75rem',
                borderRadius: 10,
                background: 'var(--surface-muted)',
                border: '1px solid var(--border-light)',
              }}
            >
              <Activity size={14} color="var(--success)" className="animate-pulse-soft" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Live sync</span>
            </div>
          </div>
        </header>

        <main className="content-area">
          <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CommandPalette />
      <AIAssistant />
    </div>
  );
};
