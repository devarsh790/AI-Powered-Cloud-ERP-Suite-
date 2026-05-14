import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';

const modules = [
  { label: 'Finance', value: 'Close-ready ledger', icon: Wallet, tone: 'var(--primary)' },
  { label: 'People', value: 'Workforce capacity', icon: Users, tone: 'var(--accent-cyan)' },
  { label: 'Supply Chain', value: 'Stock and vendors', icon: Package, tone: 'var(--warning)' },
  { label: 'Projects', value: 'Delivery governance', icon: Truck, tone: 'var(--accent-purple)' },
];

const proofPoints = [
  'Role-aware ERP workspace',
  'Live finance, HR, SCM, and project signals',
  'Audit-ready approvals and policy history',
  'AI triage for risks, forecasts, and exceptions',
];

export const LandingPage = () => {
  return (
    <div className="landing-page" style={{ background: 'var(--bg-deep)' }}>
      <section className="landing-hero">
        <img src="/bg-image.webp" alt="Amdox operations facility" className="landing-hero-image" />
        <div className="landing-hero-overlay" />

        <header className="landing-nav">
          <Link to="/" className="landing-brand" aria-label="Amdox ERP home">
            <img src="/logo.jfif" alt="Amdox" />
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign in
          </Link>
        </header>

        <div className="landing-hero-content">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="label-overline" style={{ color: '#dbeafe', marginBottom: 12 }}>
              Enterprise resource planning
            </p>
            <h1>Amdox <span className="text-primary">ERP</span></h1>
            <p>
              A calm operations workspace for finance, people, supply chain, projects, intelligence, and compliance.
            </p>
            <div className="landing-actions">
              <Link to="/login" className="btn btn-primary">
                Open workspace
                <ArrowRight size={18} />
              </Link>
              <a href="#modules" className="btn btn-secondary">
                View modules
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="landing-main">
        <section className="landing-preview card enterprise-card-static" aria-label="ERP product preview">
          <div className="panel-heading">
            <div>
              <p className="label-overline">Workspace preview</p>
              <h2>One operating layer for every team</h2>
            </div>
            <span className="badge badge-success">
              <CheckCircle2 size={13} />
              Production ready
            </span>
          </div>

          <div className="grid-12">
            <div className="span-8">
              <div className="landing-screen">
                <div className="landing-screen-top">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="landing-screen-grid">
                  {modules.map((module) => (
                    <div key={module.label} className="module-health-row">
                      <div className="metric-icon" style={{ color: module.tone }}>
                        <module.icon size={18} />
                      </div>
                      <div>
                        <strong>{module.label}</strong>
                        <small>{module.value}</small>
                      </div>
                    </div>
                  ))}
                  <div className="landing-chart">
                    <BarChart3 size={24} color="var(--primary)" />
                    <div>
                      <strong>Live operating signal</strong>
                      <small>Forecast variance, approvals, and risk exceptions in one executive view.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="span-4 landing-proof-list">
              {proofPoints.map((point) => (
                <div key={point}>
                  <CheckCircle2 size={17} color="var(--success)" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="landing-section">
          <div className="module-header">
            <div className="module-title">
              <p className="label-overline" style={{ color: 'var(--primary)' }}>
                Platform modules
              </p>
              <h2>Designed for repeated enterprise work</h2>
            </div>
            <Link to="/login" className="btn btn-primary">
              Begin onboarding
            </Link>
          </div>

          <div className="dashboard-grid">
            {[
              { title: 'Finance controls', body: 'Invoices, payables, receivables, ledger, reports.', icon: Wallet },
              { title: 'Workforce operations', body: 'Employees, payroll, attendance, leave, roles.', icon: Users },
              { title: 'Supply chain command', body: 'Inventory, purchase orders, vendors, stock risk.', icon: Package },
              { title: 'Decision intelligence', body: 'Forecasting, risk, BI widgets, AI recommendations.', icon: BrainCircuit },
              { title: 'Audit and compliance', body: 'Access reviews, policy status, immutable changes.', icon: ShieldCheck },
              { title: 'Admin foundation', body: 'Tenant settings, integrations, API and webhook control.', icon: Building2 },
            ].map((item) => (
              <article key={item.title} className="card enterprise-card-static">
                <div className="metric-icon" style={{ color: 'var(--primary)', marginBottom: 14 }}>
                  <item.icon size={19} />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem' }}>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
