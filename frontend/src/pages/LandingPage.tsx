import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  BarChart3,
  Users,
  Box,
  Globe,
  Cpu,
  Zap,
  Activity,
  LineChart,
  Building2,
  Lock,
  Server,
} from 'lucide-react';

export const LandingPage = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const features = [
    {
      title: 'AI forecasting',
      desc: 'Turn historical operations into calibrated forward views with confidence bands your teams can trust.',
      icon: BrainCircuit,
      accent: 'var(--primary)',
    },
    {
      title: 'HR automation',
      desc: 'Lifecycle workflows, compliance checkpoints, and workforce analytics in one modular surface.',
      icon: Users,
      accent: 'var(--accent-cyan)',
    },
    {
      title: 'Financial intelligence',
      desc: 'Real-time ledger intelligence, exposure views, and automated reconciliation for complex entities.',
      icon: BarChart3,
      accent: 'var(--accent-purple)',
    },
    {
      title: 'Supply chain AI',
      desc: 'Inventory, procurement, and logistics signals unified with predictive replenishment.',
      icon: Box,
      accent: 'var(--success)',
    },
    {
      title: 'Enterprise security',
      desc: 'Tenant isolation, RBAC, encryption in transit and at rest — presented with engineering clarity.',
      icon: ShieldCheck,
      accent: 'var(--danger)',
    },
    {
      title: 'Real-time analytics',
      desc: 'Streaming KPIs, drill-downs, and governed metrics without dashboard clutter.',
      icon: LineChart,
      accent: 'var(--info)',
    },
    {
      title: 'Cloud infrastructure',
      desc: 'Elastic scale, health telemetry, and deployment visibility for mission-critical ERP workloads.',
      icon: Globe,
      accent: 'var(--accent-cyan)',
    },
    {
      title: 'Multi-tenant architecture',
      desc: 'Isolated workspaces, centralized governance, and audit-ready change history by design.',
      icon: Building2,
      accent: 'var(--primary)',
    },
  ];

  const highlights = [
    {
      kicker: 'Signal, not noise',
      title: 'Executive dashboards that read like engineering documentation.',
      body: 'Large type, tight grids, and modular cards keep complex operations legible for operators and leadership alike.',
      align: 'left' as const,
    },
    {
      kicker: 'Operational trust',
      title: 'Every insight is traceable to source systems and policy.',
      body: 'Role-aware surfaces, immutable audit trails, and health indicators mirror how serious B2B platforms earn adoption.',
      align: 'right' as const,
    },
  ];

  return (
    <div className="landing-page dot-grid" style={{ background: 'var(--bg-deep)', overflowX: 'hidden' }}>
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem) 1.5rem 0',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <motion.div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none', opacity }}>
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '-25%',
              left: '15%',
              width: '70vw',
              height: '70vw',
              background: 'radial-gradient(circle, rgba(230, 74, 25, 0.14) 0%, transparent 68%)',
              filter: 'blur(90px)',
            }}
          />
        </motion.div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 920 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '0.45rem 1rem',
                borderRadius: 999,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.75rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>NEW</span>
              <span>AI ERP · enterprise release</span>
              <Activity size={14} className="animate-pulse-soft" />
            </div>

            <h1 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              The intelligent <span className="text-gradient">operating layer</span> for global operations
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                maxWidth: 680,
                margin: '0 auto 2rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
              }}
            >
              Nexus unifies finance, people, supply chain, and projects in a minimal, industrial interface — built for scale,
              auditability, and calm decision-making.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Access workspace <ArrowRight size={18} />
              </Link>
              <button type="button" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Talk to solutions
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 'clamp(3rem, 8vw, 5rem)',
            width: 'min(1120px, 92vw)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            className="glass-panel"
            style={{
              borderRadius: '24px 24px 0 0',
              padding: '1.25rem',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div
              style={{
                borderRadius: 16,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '0.75rem',
                minHeight: 380,
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    gridColumn: 'span 4',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div className="skeleton" style={{ height: 10, width: '40%' }} />
                  <div className="skeleton" style={{ height: 28, width: '55%' }} />
                  <div className="skeleton" style={{ height: 72, width: '100%', borderRadius: 12 }} />
                </div>
              ))}
              <div className="glass-card" style={{ gridColumn: 'span 8', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div className="skeleton" style={{ height: 12, width: '30%' }} />
                  <Cpu size={22} color="var(--primary)" />
                </div>
                <div className="skeleton" style={{ height: 200, width: '100%', borderRadius: 12 }} />
              </div>
              <div className="glass-card" style={{ gridColumn: 'span 4', padding: '1rem' }}>
                <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 12 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="skeleton" style={{ height: 44, borderRadius: 10 }} />
                  <div className="skeleton" style={{ height: 44, borderRadius: 10 }} />
                  <div className="skeleton" style={{ height: 44, borderRadius: 10 }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section style={{ padding: 'clamp(4rem, 10vw, 8rem) 1.5rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <p className="label-overline" style={{ marginBottom: 12, color: 'var(--primary)' }}>
            Platform modules
          </p>
          <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Engineering-grade capability grid</h2>
          <p style={{ maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
            Modular services, minimal chrome, and spacious layouts — the same discipline used in advanced industrial software.
          </p>
        </div>

        <div className="grid-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                boxShadow: `0 20px 40px -12px ${f.accent}30, 0 0 0 1px ${f.accent}20 inset`
              }}
              onHoverStart={() => setHoveredFeature(i)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="card span-3"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 12,
                padding: '1.25rem',
                borderBottom: `3px solid ${f.accent}`,
                background: `linear-gradient(180deg, var(--bg-card) 0%, ${f.accent}08 100%)`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <motion.div
                animate={{
                  scale: hoveredFeature === i ? 1.1 : 1,
                  rotate: hoveredFeature === i ? 5 : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${f.accent}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: f.accent,
                }}
              >
                <f.icon size={20} />
              </motion.div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 6, fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </div>
              <motion.div
                initial={false}
                animate={{ opacity: hoveredFeature === i ? 1 : 0, height: hoveredFeature === i ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8125rem', width: '100%' }}
                >
                  Learn more
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {highlights.map((h, idx) => (
        <section
          key={h.title}
          style={{
            padding: 'clamp(3.5rem, 8vw, 6rem) 1.5rem',
            borderTop: '1px solid var(--border-light)',
            background: idx % 2 === 1 ? 'var(--surface-muted)' : 'transparent',
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: h.align === 'left' ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              style={{
                gridColumn: h.align === 'left' ? 'span 6' : 'span 6',
                order: h.align === 'left' ? 1 : 2,
              }}
            >
              <p className="label-overline" style={{ marginBottom: 12, color: 'var(--accent-cyan)' }}>
                {h.kicker}
              </p>
              <h2 style={{ marginBottom: '1rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{h.title}</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{h.body}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              style={{ gridColumn: 'span 6', order: h.align === 'left' ? 2 : 1 }}
            >
              <div className="card enterprise-card-static" style={{ padding: '2rem', minHeight: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                  <Lock size={20} color="var(--primary)" />
                  <span className="label-overline">Governed telemetry</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 14, width: '70%' }} />
                  <div className="skeleton" style={{ height: 14, width: '55%' }} />
                  <div className="skeleton" style={{ height: 120, borderRadius: 14 }} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <Server size={18} color="var(--text-dim)" />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
                    Multi-region · encrypted · observable
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      <section
        style={{
          padding: 'clamp(4rem, 9vw, 7rem) 1.5rem',
          textAlign: 'center',
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <div className="card enterprise-card-static" style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(2.5rem, 6vw, 4rem)' }}>
          <Zap size={40} color="var(--accent-cyan)" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.3, marginBottom: '1.25rem' }}>
            “We moved from reactive operations to a single pane of glass the executive team actually uses.”
          </h2>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.08em', fontSize: '0.75rem' }}>
            CHIEF OPERATING OFFICER · GLOBAL LOGISTICS
          </p>
        </div>

        <div style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Deploy with confidence</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Start with a focused workspace and expand modules as your operating model matures.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary">
              Begin onboarding
            </Link>
            <button type="button" className="btn btn-secondary">
              Contact engineering
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 'clamp(3rem, 6vw, 4rem)',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-light)',
            color: 'var(--text-dim)',
            fontSize: '0.8125rem',
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src="/logo.jfif"
                alt="Amdox Logo"
                style={{
                  height: 44,
                  width: 'auto',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="#privacy" className="landing-footer-link">
                Privacy
              </a>
              <a href="#terms" className="landing-footer-link">
                Terms
              </a>
              <a href="#security" className="landing-footer-link">
                Security
              </a>
            </div>
            <span>© 2026 Operations Core</span>
          </div>
        </div>
      </section>
    </div>
  );
};
