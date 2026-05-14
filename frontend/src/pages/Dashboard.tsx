import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  DollarSign,
  Download,
  Package,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type IconType = LucideIcon;
type TimeRange = '24h' | '7d' | '30d';

interface Kpi {
  label: string;
  value: string;
  delta: string;
  tone: string;
  icon: IconType;
  caption: string;
}

interface QueueItem {
  title: string;
  meta: string;
  tone: 'danger' | 'warning' | 'success' | 'info';
  icon: IconType;
}

interface ModuleHealth {
  label: string;
  owner: string;
  score: number;
  status: string;
  tone: string;
  icon: IconType;
}

interface DashboardData {
  kpis: Kpi[];
  forecast: Array<{ period: string; actual: number; forecast: number }>;
  utilization: Array<{ name: string; value: number }>;
  queue: QueueItem[];
  modules: ModuleHealth[];
}

const rangeOptions: TimeRange[] = ['24h', '7d', '30d'];

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `INR ${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `INR ${(value / 100000).toFixed(2)} L`;
  return `INR ${value.toLocaleString('en-IN')}`;
};

const getForecastData = (range: TimeRange) => {
  const source = {
    '24h': [
      { period: '00:00', actual: 3.8, forecast: 4.1 },
      { period: '04:00', actual: 3.2, forecast: 3.3 },
      { period: '08:00', actual: 4.9, forecast: 4.7 },
      { period: '12:00', actual: 5.4, forecast: 5.2 },
      { period: '16:00', actual: 4.8, forecast: 5.0 },
      { period: '20:00', actual: 5.7, forecast: 5.5 },
    ],
    '7d': [
      { period: 'Mon', actual: 44, forecast: 46 },
      { period: 'Tue', actual: 52, forecast: 49 },
      { period: 'Wed', actual: 47, forecast: 48 },
      { period: 'Thu', actual: 58, forecast: 54 },
      { period: 'Fri', actual: 61, forecast: 59 },
      { period: 'Sat', actual: 35, forecast: 36 },
      { period: 'Sun', actual: 31, forecast: 32 },
    ],
    '30d': [
      { period: 'Week 1', actual: 318, forecast: 330 },
      { period: 'Week 2', actual: 346, forecast: 352 },
      { period: 'Week 3', actual: 371, forecast: 366 },
      { period: 'Week 4', actual: 414, forecast: 404 },
    ],
  };

  return source[range];
};

const buildDashboardData = (range: TimeRange, jitter = 0): DashboardData => ({
  kpis: [
    {
      label: 'Net operating value',
      value: formatCurrency(14500000 + jitter * 120000),
      delta: '+12.5%',
      caption: 'vs. prior operating window',
      tone: 'var(--primary)',
      icon: DollarSign,
    },
    {
      label: 'People available',
      value: `${1240 + jitter}`,
      delta: '+2.1%',
      caption: 'active workforce capacity',
      tone: 'var(--accent-cyan)',
      icon: Users,
    },
    {
      label: 'Inventory coverage',
      value: `${(28.4 + jitter * 0.1).toFixed(1)} days`,
      delta: '-3.2%',
      caption: 'healthy stock horizon',
      tone: 'var(--warning)',
      icon: Package,
    },
    {
      label: 'Automation rate',
      value: `${(78.6 + jitter * 0.4).toFixed(1)}%`,
      delta: '+5.4%',
      caption: 'touchless transactions',
      tone: 'var(--success)',
      icon: Zap,
    },
  ],
  forecast: getForecastData(range).map((point, index) => ({
    ...point,
    actual: Number((point.actual + (jitter ? (index % 2 === 0 ? 0.8 : -0.4) : 0)).toFixed(1)),
  })),
  utilization: [
    { name: 'Fin', value: 72 + jitter },
    { name: 'HR', value: 58 + Math.round(jitter / 2) },
    { name: 'SCM', value: 84 - Math.round(jitter / 2) },
    { name: 'Ops', value: 91 },
    { name: 'IT', value: 66 + jitter },
  ],
  queue: [
    {
      title: 'Approve 7 vendor payments',
      meta: 'Finance close - due today',
      tone: 'warning',
      icon: Wallet,
    },
    {
      title: 'Resolve stockout risk',
      meta: 'SKU AX-204 below safety stock',
      tone: 'danger',
      icon: AlertTriangle,
    },
    {
      title: 'Review access exception',
      meta: 'Admin sign-in from new device',
      tone: 'info',
      icon: ShieldCheck,
    },
    {
      title: 'Payroll cycle validated',
      meta: '1,218 employees ready',
      tone: 'success',
      icon: CheckCircle2,
    },
  ],
  modules: [
    { label: 'Finance', owner: 'Controller team', score: 92, status: 'Close on track', tone: 'var(--primary)', icon: Wallet },
    { label: 'People', owner: 'HR operations', score: 86, status: '3 leave conflicts', tone: 'var(--accent-cyan)', icon: Users },
    { label: 'Supply Chain', owner: 'Procurement', score: 74, status: '2 critical POs', tone: 'var(--warning)', icon: Truck },
    { label: 'Projects', owner: 'PMO', score: 81, status: 'Budget watch', tone: 'var(--accent-purple)', icon: BarChart3 },
  ],
});

const toneToClass: Record<QueueItem['tone'], string> = {
  danger: 'badge-danger',
  warning: 'badge-warning',
  success: 'badge-success',
  info: 'bg-info-bg',
};

export const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('7d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setData(buildDashboardData(selectedRange));
      setLoading(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [selectedRange]);

  const statusStrip = useMemo(
    () => [
      { label: 'Environment', value: 'Production', detail: 'All services reporting' },
      { label: 'Data sync', value: 'Live', detail: 'Last event 38 sec ago' },
      { label: 'Open approvals', value: '17', detail: '6 need same-day action' },
      { label: 'Risk posture', value: 'Moderate', detail: '2 policy exceptions' },
    ],
    [],
  );

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setData(buildDashboardData(selectedRange, Math.floor(Math.random() * 4) + 1));
    setRefreshing(false);
    toast.success('Workspace signals refreshed');
  };

  if (loading || !data) {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div className="skeleton" style={{ width: 320, height: 42 }} />
        <div className="grid-12">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card span-3" style={{ minHeight: 148 }}>
              <div className="skeleton" style={{ height: 14, width: '46%', marginBottom: 18 }} />
              <div className="skeleton" style={{ height: 34, width: '64%', marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 48, width: '100%' }} />
            </div>
          ))}
        </div>
        <div className="skeleton" style={{ minHeight: 360 }} />
      </div>
    );
  }

  return (
    <div className="module-page animate-fade-in">
      <div className="module-header">
        <div className="module-title">
          <p className="label-overline" style={{ color: 'var(--primary)' }}>
            ERP command center
          </p>
          <h1>Operations <span className="text-primary">workspace</span></h1>
          <p style={{ maxWidth: 720, fontSize: '0.9375rem' }}>
            A focused control room for finance, workforce, supply chain, project delivery, and risk decisions.
          </p>
        </div>

        <div className="module-toolbar">
          <button type="button" className="btn btn-secondary" onClick={() => toast.success('Export downloaded successfully')}>
            <Download size={17} />
            Export brief</button>
          <button type="button" className="btn btn-secondary" onClick={refreshData} disabled={refreshing}>
            <RefreshCcw size={17} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing' : 'Refresh'}
          </button>
          <button type="button" className="btn btn-primary">
            <BrainCircuit size={17} />
            AI triage
          </button>
        </div>
      </div>

      <section className="card enterprise-card-static" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="control-strip">
          {statusStrip.map((item) => (
            <div key={item.label} className="control-strip-item">
              <p className="label-overline">{item.label}</p>
              <strong>{item.value}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <motion.section className="grid-12" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {data.kpis.map((kpi, index) => (
          <motion.article
            key={kpi.label}
            className="card span-3 enterprise-card-static"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 156 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <p className="label-overline">{kpi.label}</p>
                <h2 style={{ marginTop: 6, fontSize: '1.55rem' }}>{kpi.value}</h2>
              </div>
              <div className="metric-icon" style={{ color: kpi.tone }}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <span className="badge badge-success">
                <ArrowUpRight size={12} />
                {kpi.delta}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textAlign: 'right' }}>{kpi.caption}</span>
            </div>
          </motion.article>
        ))}
      </motion.section>

      <section className="grid-12">
        <article className="card span-8 enterprise-card-static" style={{ minHeight: 390 }}>
          <div className="panel-heading">
            <div>
              <p className="label-overline">Demand and cash signal</p>
              <h3>Actuals vs forecast</h3>
            </div>
            <div className="segmented-control" role="tablist" aria-label="Forecast range">
              {rangeOptions.map((range) => (
                <button
                  key={range}
                  type="button"
                  className={selectedRange === range ? 'active' : ''}
                  onClick={() => setSelectedRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 290 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.forecast} margin={{ top: 12, right: 18, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="chart-tooltip">
                        <strong>{label}</strong>
                        {payload.map((entry: any) => (
                          <span key={entry.dataKey}>
                            {entry.name}: {entry.value}
                          </span>
                        ))}
                      </div>
                    );
                  }}
                />
                <Area dataKey="forecast" name="Forecast" type="monotone" stroke="var(--text-dim)" strokeDasharray="6 6" fill="transparent" strokeWidth={2} />
                <Area dataKey="actual" name="Actual" type="monotone" stroke="var(--primary)" fill="url(#actualValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card span-4 enterprise-card-static" style={{ minHeight: 390 }}>
          <div className="panel-heading">
            <div>
              <p className="label-overline">Priority queue</p>
              <h3>Next best actions</h3>
            </div>
            <Clock3 size={19} color="var(--text-dim)" />
          </div>

          <div className="queue-list">
            {data.queue.map((item) => (
              <button key={item.title} type="button" className="queue-item">
                <span className={`queue-icon ${toneToClass[item.tone]}`}>
                  <item.icon size={16} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.meta}</small>
                </span>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="grid-12">
        <article className="card span-6 enterprise-card-static">
          <div className="panel-heading">
            <div>
              <p className="label-overline">Functional load</p>
              <h3>Capacity by tower</h3>
            </div>
            <Activity size={19} color="var(--text-dim)" />
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.utilization}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(37,99,235,0.06)' }} contentStyle={{ borderColor: 'var(--border-light)', borderRadius: 8 }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card span-6 enterprise-card-static">
          <div className="panel-heading">
            <div>
              <p className="label-overline">Module health</p>
              <h3>Operating system readiness</h3>
            </div>
            <ShieldCheck size={19} color="var(--success)" />
          </div>
          <div className="module-health-list">
            {data.modules.map((module) => (
              <div key={module.label} className="module-health-row">
                <div className="metric-icon" style={{ color: module.tone }}>
                  <module.icon size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <strong>{module.label}</strong>
                    <span>{module.score}%</span>
                  </div>
                  <div className="progress-track" aria-label={`${module.label} score`}>
                    <span style={{ width: `${module.score}%`, background: module.tone }} />
                  </div>
                  <small>
                    {module.owner} - {module.status}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};
