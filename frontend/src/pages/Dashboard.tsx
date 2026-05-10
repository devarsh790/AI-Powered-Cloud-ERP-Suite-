import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Users,
  Activity,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Package,
  Zap,
  Bell,
  Shield,
  Layers,
  Truck,
  Wallet,
  Server,
  ChevronDown,
} from 'lucide-react';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemFade = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedKpi, setExpandedKpi] = useState<number | null>(null);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'warning' | 'success' | 'info'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  const formatIndianShorthand = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(2)} K`;
    return `₹${val}`;
  };

  const getForecastData = (range: '24h' | '7d' | '30d') => {
    const data24h = [
      { time: '00:00', actual: 4000, forecast: 4200 },
      { time: '04:00', actual: 3000, forecast: 3100 },
      { time: '08:00', actual: 2000, forecast: 2500 },
      { time: '12:00', actual: 2780, forecast: 3000 },
      { time: '16:00', actual: 1890, forecast: 2200 },
      { time: '20:00', actual: 2390, forecast: 2800 },
      { time: '23:59', actual: 3490, forecast: 4000 },
    ];

    const data7d = [
      { time: 'Mon', actual: 45000, forecast: 47000 },
      { time: 'Tue', actual: 52000, forecast: 50000 },
      { time: 'Wed', actual: 48000, forecast: 49000 },
      { time: 'Thu', actual: 56000, forecast: 54000 },
      { time: 'Fri', actual: 61000, forecast: 58000 },
      { time: 'Sat', actual: 32000, forecast: 35000 },
      { time: 'Sun', actual: 28000, forecast: 30000 },
    ];

    const data30d = [
      { time: 'Week 1', actual: 320000, forecast: 330000 },
      { time: 'Week 2', actual: 345000, forecast: 350000 },
      { time: 'Week 3', actual: 378000, forecast: 370000 },
      { time: 'Week 4', actual: 412000, forecast: 400000 },
    ];

    switch (range) {
      case '24h': return data24h;
      case '7d': return data7d;
      case '30d': return data30d;
      default: return data24h;
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockData = {
        kpis: [
          {
            id: 1,
            label: 'Operational revenue',
            value: formatIndianShorthand(145000 + Math.random() * 10000),
            trend: '+12.5%',
            isUp: true,
            icon: DollarSign,
            color: 'var(--primary)',
            spark: [30, 45, 35, 50, 48, 65, 75],
          },
          {
            id: 2,
            label: 'Active personnel',
            value: (1200 + Math.floor(Math.random() * 100)).toLocaleString(),
            trend: '+2.1%',
            isUp: true,
            icon: Users,
            color: 'var(--accent-cyan)',
            spark: [10, 15, 12, 18, 20, 22, 25],
          },
          {
            id: 3,
            label: 'Resource efficiency',
            value: (90 + Math.random() * 5).toFixed(1) + '%',
            trend: '+5.4%',
            isUp: true,
            icon: Zap,
            color: 'var(--success)',
            spark: [80, 85, 82, 88, 90, 92, 94],
          },
          {
            id: 4,
            label: 'Inventory turnover',
            value: (8 + Math.random()).toFixed(1) + 'x',
            trend: '-2.3%',
            isUp: false,
            icon: Package,
            color: 'var(--warning)',
            spark: [10, 9, 8, 7, 8, 8.5, 8.4],
          },
        ],
        forecast: getForecastData(selectedTimeRange),
        utilization: [
          { name: 'Fin', u: 70 + Math.floor(Math.random() * 10) },
          { name: 'HR', u: 55 + Math.floor(Math.random() * 10) },
          { name: 'SCM', u: 80 + Math.floor(Math.random() * 10) },
          { name: 'Ops', u: 88 + Math.floor(Math.random() * 8) },
          { name: 'IT', u: 62 + Math.floor(Math.random() * 10) },
        ],
        logs: [
          {
            id: 1,
            title: 'AI anomaly detected',
            desc: 'Model flagged 12% drift in supply chain throughput vs. baseline.',
            time: '2m ago',
            type: 'warning',
          },
          {
            id: 2,
            title: 'Region expansion',
            desc: 'New processing node provisioned in APAC.',
            time: '15m ago',
            type: 'success',
          },
          {
            id: 3,
            title: 'Finance sync',
            desc: 'Automated ledger reconciliation completed.',
            time: '1h ago',
            type: 'info',
          },
          {
            id: 4,
            title: 'Security alert',
            desc: 'Unusual login pattern detected from new IP address.',
            time: '2h ago',
            type: 'warning',
          },
          {
            id: 5,
            title: 'System backup',
            desc: 'Daily backup completed successfully.',
            time: '3h ago',
            type: 'success',
          },
        ],
        ops: [
          { label: 'Inventory health', value: (95 + Math.random() * 5).toFixed(1) + '%', sub: 'On-hand vs. target', icon: Package, tone: 'var(--success)' },
          { label: 'Payroll cycle', value: Math.random() > 0.3 ? 'Closed' : 'In Progress', sub: 'Next run · 3d', icon: Wallet, tone: 'var(--accent-cyan)' },
          { label: 'In-transit POs', value: 40 + Math.floor(Math.random() * 10), sub: '12 critical path', icon: Truck, tone: 'var(--info)' },
        ],
      };
      setData(mockData);
      toast.success('Dashboard refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh dashboard data', error);
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));
        const mockData = {
          kpis: [
            {
              id: 1,
              label: 'Operational revenue',
              value: formatIndianShorthand(145000),
              trend: '+12.5%',
              isUp: true,
              icon: DollarSign,
              color: 'var(--primary)',
              spark: [30, 45, 35, 50, 48, 65, 75],
            },
            {
              id: 2,
              label: 'Active personnel',
              value: '1,240',
              trend: '+2.1%',
              isUp: true,
              icon: Users,
              color: 'var(--accent-cyan)',
              spark: [10, 15, 12, 18, 20, 22, 25],
            },
            {
              id: 3,
              label: 'Resource efficiency',
              value: '94.2%',
              trend: '+5.4%',
              isUp: true,
              icon: Zap,
              color: 'var(--success)',
              spark: [80, 85, 82, 88, 90, 92, 94],
            },
            {
              id: 4,
              label: 'Inventory turnover',
              value: '8.4x',
              trend: '-2.3%',
              isUp: false,
              icon: Package,
              color: 'var(--warning)',
              spark: [10, 9, 8, 7, 8, 8.5, 8.4],
            },
          ],
          forecast: getForecastData(selectedTimeRange),
          utilization: [
            { name: 'Fin', u: 72 },
            { name: 'HR', u: 58 },
            { name: 'SCM', u: 84 },
            { name: 'Ops', u: 91 },
            { name: 'IT', u: 66 },
          ],
          logs: [
            {
              id: 1,
              title: 'AI anomaly detected',
              desc: 'Model flagged 12% drift in supply chain throughput vs. baseline.',
              time: '2m ago',
              type: 'warning',
            },
            {
              id: 2,
              title: 'Region expansion',
              desc: 'New processing node provisioned in APAC.',
              time: '15m ago',
              type: 'success',
            },
            {
              id: 3,
              title: 'Finance sync',
              desc: 'Automated ledger reconciliation completed.',
              time: '1h ago',
              type: 'info',
            },
            {
              id: 4,
              title: 'Security alert',
              desc: 'Unusual login pattern detected from new IP address.',
              time: '2h ago',
              type: 'warning',
            },
            {
              id: 5,
              title: 'System backup',
              desc: 'Daily backup completed successfully.',
              time: '3h ago',
              type: 'success',
            },
          ],
          ops: [
            { label: 'Inventory health', value: '98.2%', sub: 'On-hand vs. target', icon: Package, tone: 'var(--success)' },
            { label: 'Payroll cycle', value: 'Closed', sub: 'Next run · 3d', icon: Wallet, tone: 'var(--accent-cyan)' },
            { label: 'In-transit POs', value: '42', sub: '12 critical path', icon: Truck, tone: 'var(--info)' },
          ],
        };
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [selectedTimeRange]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '60vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
        }}
      >
        <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 14 }} />
        <span className="label-overline" style={{ letterSpacing: '0.14em' }}>
          Loading executive overview
        </span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 4vw, 3rem)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--primary)',
              marginBottom: 8,
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <Layers size={16} />
            Executive overview
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            Operational <span className="text-gradient">intelligence</span>
          </h1>
          <p style={{ marginTop: 8, maxWidth: 520, fontSize: '0.9375rem' }}>
            Unified signals across finance, people, inventory, and delivery — engineered for enterprise clarity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => refreshData()}
            disabled={refreshing}
            style={{ opacity: refreshing ? 0.7 : 1, cursor: refreshing ? 'not-allowed' : 'pointer' }}
          >
            <Activity size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'System health'}
          </button>
          <button type="button" className="btn btn-primary">
            <BrainCircuit size={18} />
            AI insights
          </button>
        </div>
      </div>

      <motion.div className="grid-12" variants={stagger} initial="hidden" animate="show">
        {data.kpis.map((kpi: any) => (
          <motion.div
            key={kpi.id}
            variants={itemFade}
            className="card span-3 card-kpi enterprise-card-static"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={() => setExpandedKpi(expandedKpi === kpi.id ? null : kpi.id)}
            style={{ cursor: 'pointer', position: 'relative', padding: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--surface-muted)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: kpi.color,
                }}
              >
                <kpi.icon size={18} />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: kpi.isUp ? 'var(--success)' : 'var(--danger)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: kpi.isUp ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: 6,
                }}
              >
                {kpi.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {kpi.trend}
              </div>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', marginBottom: 3, color: 'var(--text-secondary)' }}>{kpi.label}</p>
              <h2 style={{ fontSize: '1.4rem' }}>{kpi.value}</h2>
            </div>

            <div style={{ height: 36, width: '100%', marginTop: 'auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.spark.map((v: number, i: number) => ({ v, i }))}>
                  <defs>
                    <linearGradient id={`kpiSpark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={kpi.color} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={kpi.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={kpi.color}
                    strokeWidth={2}
                    fill={`url(#kpiSpark-${kpi.id})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <AnimatePresence>
              {expandedKpi === kpi.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Last 7 days trend</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {kpi.spark.map((v: number, i: number) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: 6,
                            background: 'var(--bg-secondary)',
                            fontSize: '0.75rem',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-light)'
                          }}
                        >
                          Day {i + 1}: {v}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Viewing detailed ${kpi.label} analytics`);
                      }}
                    >
                      View full analytics
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', opacity: 0.5 }}>
              <ChevronDown size={14} style={{ transform: expandedKpi === kpi.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
      >
        {data.ops.map((op: any, i: number) => (
          <motion.div
            key={op.label}
            className="card span-4 enterprise-card-static"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.875rem' }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: '1px solid var(--border-light)',
                background: 'var(--surface-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: op.tone,
              }}
            >
              <op.icon size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="label-overline" style={{ marginBottom: 3, fontSize: '0.7rem' }}>
                {op.label}
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{op.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>{op.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid-12">
        <motion.div
          className="card span-8 enterprise-card-static"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ padding: '1rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ marginBottom: 3, fontSize: '1rem' }}>Demand forecast</h3>
              <p style={{ fontSize: '0.75rem' }}>Actual vs. model — next {selectedTimeRange === '24h' ? '24 hours' : selectedTimeRange === '7d' ? '7 days' : '30 days'}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 8 }}>
                {(['24h', '7d', '30d'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedTimeRange(range)}
                    className="btn-ghost"
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: selectedTimeRange === range ? 600 : 500,
                      background: selectedTimeRange === range ? 'var(--bg-surface)' : 'transparent',
                      border: selectedTimeRange === range ? '1px solid var(--border-light)' : '1px solid transparent',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                  Actual
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-medium)' }} />
                  Forecast
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.forecast}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 12,
                            padding: '0.75rem',
                            boxShadow: 'var(--shadow-md)',
                            fontSize: '0.8125rem'
                          }}
                        >
                          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{label}</p>
                          {payload.map((entry: any, index: number) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
                              <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.value}</span>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '100%' }}
                            onClick={() => toast.success(`Drilling into ${label} data`)}
                          >
                            View details
                          </button>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="var(--border-medium)" 
                  strokeDasharray="6 6" 
                  fill="transparent" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="var(--primary)" 
                  strokeWidth={2.5} 
                  fill="url(#actualGrad)" 
                  style={{ cursor: 'pointer' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="card span-4 enterprise-card-static"
          style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem' }}>Activity</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['all', 'warning', 'success', 'info'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setLogFilter(filter)}
                  className="btn-ghost"
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: logFilter === filter ? 600 : 500,
                    background: logFilter === filter ? 'var(--bg-secondary)' : 'transparent',
                    border: logFilter === filter ? '1px solid var(--border-light)' : '1px solid transparent',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            {data.logs
              .filter((log: any) => logFilter === 'all' || log.type === logFilter)
              .map((log: any) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-md)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{log.title}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{log.time}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', lineHeight: 1.4, color: 'var(--text-secondary)' }}>{log.desc}</p>
                  <AnimatePresence>
                    {expandedLog === log.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Additional details available for this event.</p>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', alignSelf: 'flex-start' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(`Opened audit trail for ${log.title}`);
                            }}
                          >
                            View audit trail
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '1rem',
                      bottom: '1rem',
                      width: 3,
                      borderRadius: '0 4px 4px 0',
                      background:
                        log.type === 'warning' ? 'var(--warning)' : log.type === 'success' ? 'var(--success)' : 'var(--info)',
                    }}
                  />
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      position: 'absolute', 
                      bottom: '0.75rem', 
                      right: '0.75rem',
                      transform: expandedLog === log.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      color: 'var(--text-dim)'
                    }} 
                  />
                </motion.div>
              ))}
          </div>

          <button type="button" className="btn btn-secondary" style={{ marginTop: '0.875rem', width: '100%', fontSize: '0.8125rem', padding: '0.5rem' }}>
            Open audit trail
          </button>
        </motion.div>
      </div>

      <div className="grid-12">
        <motion.div
          className="card span-6 enterprise-card-static"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ padding: '1rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
            <div>
              <h3 style={{ marginBottom: 3, fontSize: '1rem' }}>Functional load</h3>
              <p style={{ fontSize: '0.75rem' }}>Resource utilization by tower</p>
            </div>
            <Server size={18} color="var(--text-dim)" />
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.utilization}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="u" fill="var(--primary)" radius={[6, 6, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="card span-6 enterprise-card-static"
          style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(241, 245, 249, 0.95) 50%, transparent 100%)',
            padding: '1rem',
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 40px var(--primary-glow)',
              }}
            >
              <Shield size={24} color="#FFF" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p className="label-overline" style={{ marginBottom: 6, color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>
                AI recommendation
              </p>
              <h3 style={{ marginBottom: 6, fontSize: '1.1rem' }}>Harden administrator access</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                Unusual access patterns detected from <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>192.168.1.1</span>.
                Enable MFA for admin roles and review session policies.
              </p>
            </div>
            <button type="button" className="btn btn-primary" style={{ alignSelf: 'center', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Review policy
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
