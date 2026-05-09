import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { 
  DollarSign, Users, Briefcase, AlertCircle, Activity, 
  BrainCircuit, TrendingUp, TrendingDown, Package, CheckCircle2 
} from 'lucide-react';
import api from '../services/api';

export const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = {
          kpis: {
            netProfit: 145000,
            totalEmployees: 124,
            activeProjects: 8,
            lowStockItems: 3
          },
          charts: {
            revenueByMonth: [
              { month: 'Jan', revenue: 45, expenses: 30 },
              { month: 'Feb', revenue: 52, expenses: 32 },
              { month: 'Mar', revenue: 48, expenses: 35 },
              { month: 'Apr', revenue: 61, expenses: 38 },
              { month: 'May', revenue: 59, expenses: 40 },
              { month: 'Jun', revenue: 75, expenses: 42 }
            ],
            departmentBreakdown: [
              { _id: 'Engineering', count: 45 },
              { _id: 'Sales', count: 25 },
              { _id: 'HR', count: 12 },
              { _id: 'Marketing', count: 18 }
            ]
          },
          recentNotifications: [
            { _id: 1, title: 'Payroll Processed', message: 'May 2026 payroll completed', type: 'success', createdAt: new Date().toISOString() },
            { _id: 2, title: 'Low Stock Alert', message: 'Server Rack Units below threshold', type: 'warning', createdAt: new Date(Date.now() - 86400000).toISOString() }
          ]
        };
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '50px', height: '50px', border: '3px solid rgba(0,240,255,0.1)', borderTopColor: 'var(--primary-neon)', borderRadius: '50%', animation: 'spin 1s linear infinite', boxShadow: 'var(--shadow-neon)' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) return <div style={{ color: 'var(--danger)' }}>Failed to initialize Nexus data</div>;

  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const colors = {
    neonCyan: '#00F0FF',
    neonMagenta: '#FF00EA',
    neonGreen: '#00FF66',
    neonRed: '#FF3366',
    textMuted: '#8F9BB3'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BrainCircuit style={{ color: 'var(--primary-neon)', filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }} size={32} />
            <span style={{ textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>NEXUS COMMAND</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Live Telemetry & Global Metrics
          </p>
        </div>
      </div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="dashboard-grid"
      >
        <motion.div variants={item} className="glass-card glass-card-interactive">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Net Revenue Stream</p>
              <h3 style={{ fontSize: '2rem', color: 'var(--text-main)', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                ${data?.kpis?.netProfit?.toLocaleString() || '0'}
              </h3>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' }}>
              <DollarSign style={{ color: 'var(--primary-neon)' }} size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', textShadow: '0 0 5px rgba(0,255,102,0.5)' }}>
              <TrendingUp size={14} style={{ marginRight: '4px' }}/> +12.5%
            </span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>vs prior cycle</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card glass-card-interactive">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Active Personnel</p>
              <h3 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{data.kpis.totalEmployees}</h3>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,0,234,0.1)', border: '1px solid rgba(255,0,234,0.2)' }}>
              <Users style={{ color: 'var(--secondary-neon)' }} size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', textShadow: '0 0 5px rgba(0,255,102,0.5)' }}>
              <TrendingUp size={14} style={{ marginRight: '4px' }}/> +2.1%
            </span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>vs prior cycle</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card glass-card-interactive">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Live Operations</p>
              <h3 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{data.kpis.activeProjects}</h3>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.2)' }}>
              <Briefcase style={{ color: 'var(--success)' }} size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card glass-card-interactive">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Critical Resources</p>
              <h3 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{data.kpis.lowStockItems}</h3>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,176,0,0.1)', border: '1px solid rgba(255,176,0,0.2)' }}>
              <Package style={{ color: 'var(--warning)' }} size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', textShadow: '0 0 5px rgba(255,51,102,0.5)' }}>
              <TrendingDown size={14} style={{ marginRight: '4px' }}/> -5.0%
            </span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>vs prior cycle</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="dashboard-section"
      >
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity style={{ color: 'var(--primary-neon)' }} size={20} />
            Telemetry Forecast
          </h3>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.revenueByMonth || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.neonCyan} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={colors.neonCyan} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.neonMagenta} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={colors.neonMagenta} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: colors.textMuted, fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: colors.textMuted, fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,15,25,0.9)', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid rgba(0,240,255,0.3)', boxShadow: '0 0 15px rgba(0,240,255,0.1)' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Area type="monotone" dataKey="revenue" name="Income (M)" stroke={colors.neonCyan} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" name="Burn (M)" stroke={colors.neonMagenta} strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users style={{ color: 'var(--secondary-neon)' }} size={20} />
            Division Matrix
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.charts?.departmentBreakdown || []}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                  stroke="none"
                >
                  {(data?.charts?.departmentBreakdown || []).map((_, index) => {
                    const pieColors = [colors.neonCyan, colors.neonMagenta, colors.neonGreen, colors.neonRed];
                    return <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} style={{ filter: `drop-shadow(0 0 5px ${pieColors[index % pieColors.length]}80)` }} />;
                  })}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10,15,25,0.9)', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid rgba(255,0,234,0.3)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {(data?.charts?.departmentBreakdown || []).map((dept: any, i: number) => {
              const pieColors = [colors.neonCyan, colors.neonMagenta, colors.neonGreen, colors.neonRed];
              return (
                <div key={dept._id} style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px', backgroundColor: pieColors[i % pieColors.length], boxShadow: `0 0 8px ${pieColors[i % pieColors.length]}` }}></span>
                  {dept._id}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle style={{ color: 'var(--warning)' }} size={20} />
          System Logs
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.recentNotifications.map((notif: any) => {
            let logColor = 'var(--primary-neon)';
            let logBg = 'rgba(0,240,255,0.1)';
            if (notif.type === 'error') { logColor = 'var(--danger)'; logBg = 'rgba(255,51,102,0.1)'; }
            else if (notif.type === 'warning') { logColor = 'var(--warning)'; logBg = 'rgba(255,176,0,0.1)'; }
            else if (notif.type === 'success') { logColor = 'var(--success)'; logBg = 'rgba(0,255,102,0.1)'; }
            
            return (
              <div key={notif._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s ease' }} className="log-entry">
                <div style={{ marginTop: '2px', color: logColor, background: logBg, padding: '6px', borderRadius: '8px' }}>
                  {notif.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{notif.title}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{notif.message}</p>
                </div>
              </div>
            );
          })}
          {data.recentNotifications.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0' }}>No recent logs detected</div>
          )}
        </div>
      </div>
    </div>
  );
};
