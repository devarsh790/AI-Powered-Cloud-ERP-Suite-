import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  LayoutDashboard,
  BarChart3,
  Users,
  Box,
  Briefcase,
  Settings,
  Shield,
  Webhook,
  BrainCircuit,
  FileBarChart,
  Truck,
  CalendarRange,
  Clock3,
  Users2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OPEN_EVENT = 'amdox:open-command-palette';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [modKey, setModKey] = useState('Cmd');
  const navigate = useNavigate();

  useEffect(() => {
    const isApple =
      typeof navigator !== 'undefined' &&
      (/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.platform === 'MacIntel');
    setModKey(isApple ? 'Cmd' : 'Ctrl');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener(OPEN_EVENT, handleOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener(OPEN_EVENT, handleOpen);
    };
  }, []);

  const commands = [
    { name: 'Executive dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
    { name: 'Finance ledger', path: '/dashboard/finance/ledger', icon: BarChart3, section: 'Finance' },
    { name: 'Finance aging reports', path: '/dashboard/finance/reports', icon: FileBarChart, section: 'Finance' },
    { name: 'HR employees', path: '/dashboard/hr/employees', icon: Users, section: 'Human resources' },
    { name: 'HR leave', path: '/dashboard/hr/leave', icon: CalendarRange, section: 'Human resources' },
    { name: 'HR attendance', path: '/dashboard/hr/attendance', icon: Clock3, section: 'Human resources' },
    { name: 'Inventory', path: '/dashboard/supply-chain/inventory', icon: Box, section: 'Supply chain' },
    { name: 'Vendors', path: '/dashboard/supply-chain/vendors', icon: Truck, section: 'Supply chain' },
    { name: 'Projects', path: '/dashboard/projects/list', icon: Briefcase, section: 'Delivery' },
    { name: 'Resource allocation', path: '/dashboard/projects/resources', icon: Users2, section: 'Delivery' },
    { name: 'BI workspace', path: '/dashboard/intelligence', icon: BarChart3, section: 'Intelligence' },
    { name: 'AI demand forecast', path: '/dashboard/intelligence/forecast', icon: BrainCircuit, section: 'Intelligence' },
    { name: 'Audit & GDPR', path: '/dashboard/audit', icon: Shield, section: 'Compliance' },
    { name: 'API & webhooks', path: '/dashboard/integrations', icon: Webhook, section: 'Platform' },
    { name: 'Settings & admin', path: '/dashboard/settings', icon: Settings, section: 'System' },
  ];

  const filtered = commands.filter((cmd) => cmd.name.toLowerCase().includes(query.toLowerCase()));

  const runNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.25)',
              backdropFilter: 'blur(12px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Command search"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 560,
              background: 'var(--bg-surface)',
              borderRadius: 20,
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(15,23,42,0.04) inset',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.125rem 1.25rem',
                borderBottom: '1px solid var(--border-light)',
                background: 'var(--surface-muted)',
                gap: '0.75rem',
              }}
            >
              <Search size={20} color="var(--text-dim)" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules, records, or actions..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <kbd
                style={{
                  padding: '0.2rem 0.5rem',
                  background: 'var(--surface-muted)',
                  borderRadius: 6,
                  fontSize: '0.65rem',
                  color: 'var(--text-dim)',
                  border: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ESC
              </kbd>
            </div>

            <div style={{ maxHeight: 360, overflowY: 'auto', padding: '0.5rem' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No matches. Try another keyword.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p
                    className="label-overline"
                    style={{ padding: '0.5rem 0.75rem', marginTop: 4 }}
                  >
                    Navigate
                  </p>
                  {filtered.map((cmd) => (
                    <motion.button
                      key={cmd.path}
                      type="button"
                      whileHover={{ x: 3, background: 'var(--hover-surface)' }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => runNavigate(cmd.path)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.875rem',
                        borderRadius: 12,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: 'var(--surface-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <cmd.icon size={18} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', fontWeight: 600 }}>
                            {cmd.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{cmd.section}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.55 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>Open</span>
                        <ArrowRight size={14} color="var(--primary)" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                padding: '0.75rem 1.25rem',
                borderTop: '1px solid var(--border-light)',
                background: 'var(--surface-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className="kbd-group">
                    <kbd className="kbd">{modKey}</kbd>
                    <kbd className="kbd">K</kbd>
                  </span>
                  Toggle
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.08em' }}>
                AMDOX WORKSPACE
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
