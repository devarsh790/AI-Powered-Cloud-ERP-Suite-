import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Save,
  Download,
  LayoutGrid,
  BrainCircuit,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'amdox-bi-widgets-v1';

type WidgetId = 'revenue' | 'mix' | 'runrate' | 'risks';

const defaultWidgets: WidgetId[] = ['risks', 'revenue', 'mix', 'runrate'];

const revenueSeed = [
  { name: 'Jan', actual: 42, plan: 40 },
  { name: 'Feb', actual: 48, plan: 44 },
  { name: 'Mar', actual: 51, plan: 50 },
  { name: 'Apr', actual: 56, plan: 52 },
  { name: 'May', actual: 62, plan: 58 },
];

const mixSeed = [
  { name: 'Finance', value: 32 },
  { name: 'HR', value: 24 },
  { name: 'SCM', value: 28 },
  { name: 'Projects', value: 16 },
];

const COLORS = ['#2563eb', '#06b6d4', '#8b5cf6', '#10b981'];

export const Intelligence = () => {
  const [widgets, setWidgets] = useState<WidgetId[]>(defaultWidgets);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWidgets(JSON.parse(raw) as WidgetId[]);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: WidgetId[]) => {
    setWidgets(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    toast.success('Dashboard layout saved');
  };

  const runrate = useMemo(
    () =>
      revenueSeed.map((r, i) => ({
        ...r,
        run: r.actual * (1 + i * 0.02),
      })),
    []
  );

  const toggle = (id: WidgetId) => {
    const has = widgets.includes(id);
    const next = has ? widgets.filter((w) => w !== id) : [...widgets, id];
    if (next.length === 0) {
      toast.error('Keep at least one widget');
      return;
    }
    persist(next);
  };

  const exportPdf = () => {
    toast.success('Scheduled export: board pack PDF (demo)');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.25rem' }}>
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
            Business intelligence
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
            Executive <span className="text-gradient">workspace</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 560 }}>
            Drag-and-drop style builder (F-08): compose KPI canvases, schedule exports, and drill into operational modules.
          </p>
        </motion.div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard/intelligence/forecast" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            <BrainCircuit size={18} /> AI demand forecast <ArrowRight size={16} />
          </Link>
          <button type="button" className="btn btn-secondary" onClick={() => persist(defaultWidgets)}>
            <LayoutGrid size={18} /> Reset layout
          </button>
          <button type="button" className="btn btn-secondary" onClick={exportPdf}>
            <Download size={18} /> Export PDF
          </button>
          <button type="button" className="btn btn-primary" onClick={() => persist(widgets)}>
            <Save size={18} /> Save dashboard
          </button>
        </div>
      </div>

      <div className="card enterprise-card-static" style={{ padding: '1.25rem' }}>
        <p className="label-overline" style={{ marginBottom: 12 }}>
          Widget library
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(
            [
              { id: 'revenue' as const, label: 'Revenue vs plan', icon: BarChart3 },
              { id: 'mix' as const, label: 'Module mix', icon: PieChartIcon },
              { id: 'runrate' as const, label: 'Run-rate curve', icon: LineChartIcon },
              { id: 'risks' as const, label: 'AI Risk alerts', icon: AlertTriangle },
            ] as const
          ).map((w) => (
            <button
              key={w.id}
              type="button"
              className={`btn ${widgets.includes(w.id) ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8125rem' }}
              onClick={() => toggle(w.id)}
            >
              <w.icon size={16} /> {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        {widgets.includes('risks') && (
          <div className="card enterprise-card-static" style={{ gridColumn: '1 / -1', borderLeft: '4px solid var(--danger)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} className="text-danger" /> AI Risk Assessment
              </h3>
              <span className="badge badge-danger">Live Insight</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem', borderRadius: 8, background: 'rgba(239, 68, 68, 0.05)' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Project "Nexus Expansion" — Budget Critical</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Current spend is 114% of plan. Progress is only 72%. AI recommends immediate resource reallocation or budget adjustment.
                  </p>
                </div>
                <Link to="/dashboard/projects" className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>Review Project</Link>
              </div>
              <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem', borderRadius: 8, background: 'rgba(245, 158, 11, 0.05)' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Inventory Shortage Risk — SKU-ERP-042</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    AI predicts stock-out in 12 days based on current demand trend. Order lead time is 15 days.
                  </p>
                </div>
                <Link to="/dashboard/supply-chain/vendors" className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>View Vendors</Link>
              </div>
            </div>
          </div>
        )}

        {widgets.includes('revenue') && (
          <div className="card" style={{ minHeight: 320 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Revenue vs plan</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={revenueSeed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="plan" fill="rgba(37,99,235,0.25)" radius={[6, 6, 0, 0]} name="Plan" />
                  <Bar dataKey="actual" fill="var(--primary)" radius={[6, 6, 0, 0]} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {widgets.includes('mix') && (
          <div className="card" style={{ minHeight: 320 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Adoption by module</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={mixSeed} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={4}>
                    {mixSeed.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {widgets.includes('runrate') && (
          <div className="card" style={{ minHeight: 320, gridColumn: widgets.length === 1 ? '1 / -1' : undefined }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Forward run-rate</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={runrate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="actual" stroke="var(--primary)" strokeWidth={2} dot={false} name="Actual" />
                  <Line type="monotone" dataKey="run" stroke="var(--accent-cyan)" strokeWidth={2} dot={false} name="Run-rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
