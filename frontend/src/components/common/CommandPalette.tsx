import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { name: 'Go to Dashboard', path: '/dashboard', section: 'Navigation' },
    { name: 'View General Ledger', path: '/finance/ledger', section: 'Finance' },
    { name: 'Manage Payroll', path: '/hr/payroll', section: 'HR' },
    { name: 'Check Inventory', path: '/supply-chain/inventory', section: 'Supply Chain' },
    { name: 'New Project', path: '/projects/list', section: 'Projects' },
  ];

  const filtered = commands.filter(cmd => cmd.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-white">
              <Search size={20} className="text-slate-400 mr-3" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, pages, or data..."
                className="w-full bg-transparent border-none outline-none text-slate-900 placeholder-slate-500 font-medium"
              />
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs text-slate-600 font-mono">esc</kbd>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 bg-slate-50">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-slate-500">No commands found.</div>
              ) : (
                filtered.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(cmd.path);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-medium group-hover:text-blue-600 transition-colors">{cmd.name}</span>
                      <span className="text-xs text-slate-500">{cmd.section}</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
