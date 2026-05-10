import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, BrainCircuit, Zap, Bot } from 'lucide-react';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open AI assistant"
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          right: '1.75rem',
          zIndex: 100,
          width: 56,
          height: 56,
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, var(--primary) 0%, #d84315 55%, var(--accent-cyan) 160%)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 12px 40px rgba(230, 74, 25, 0.2), 0 0 0 1px rgba(15,23,42,0.04) inset',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <BrainCircuit size={26} color="#fff" strokeWidth={1.75} />

        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 22,
            border: '1px solid rgba(230, 74, 25, 0.45)',
            pointerEvents: 'none',
          }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel"
            style={{
              position: 'fixed',
              bottom: '5.5rem',
              right: '1.75rem',
              zIndex: 100,
              width: 'min(420px, calc(100vw - 2rem))',
              height: 520,
              maxHeight: 'calc(100vh - 7rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.25rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--surface-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(230, 74, 25, 0.15)',
                    border: '1px solid rgba(230, 74, 25, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={22} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Operations copilot
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--success)',
                        boxShadow: '0 0 12px rgba(34, 197, 94, 0.5)',
                      }}
                    />
                    <span className="label-overline" style={{ letterSpacing: '0.1em' }}>
                      Ready
                    </span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="btn-icon" aria-label="Close assistant">
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                flex: 1,
                padding: '1.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={16} color="var(--accent-cyan)" />
                </div>
                <div
                  className="glass-card"
                  style={{
                    padding: '1rem 1.125rem',
                    borderTopLeftRadius: 4,
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                  }}
                >
                  I have synchronized the latest signals from finance, HR, and supply chain. Ask for forecasts,
                  exceptions, or workflow recommendations — responses stay within your tenant boundary.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Cash flow outlook', 'Workforce risk', 'Inventory coverage'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    <Zap size={12} color="var(--accent-cyan)" />
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about KPIs, approvals, or anomalies…"
                  className="input"
                  style={{ paddingRight: '3rem', height: 48 }}
                />
                <button
                  type="button"
                  aria-label="Send message"
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'var(--primary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px var(--primary-glow)',
                  }}
                >
                  <Send size={16} color="#fff" />
                </button>
              </div>
              <p
                className="label-overline"
                style={{ textAlign: 'center', marginTop: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.12em' }}
              >
                Enterprise AI · audit-ready
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
