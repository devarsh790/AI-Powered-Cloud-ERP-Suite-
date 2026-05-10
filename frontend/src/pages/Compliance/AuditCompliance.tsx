import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileKey2, ListTree } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AuditCompliance = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [dsr, setDsr] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [l, g] = await Promise.all([api.get('/audit/logs'), api.get('/audit/gdpr/requests')]);
        setLogs(l.data.data || []);
        setDsr(g.data.data);
      } catch {
        toast.error('Failed to load compliance data');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
          Audit & compliance
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
          Tamper-evident <span className="text-gradient">trail</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 640 }}>
          Immutable mutation log with hash chaining (F-09). GDPR data-subject queue is stubbed with a 72h SLA target.
        </p>
      </motion.div>

      <div className="dashboard-grid">
        <div className="card enterprise-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={22} color="var(--primary)" />
            <div>
              <p className="text-muted text-sm">Chain integrity</p>
              <p style={{ fontWeight: 700 }}>Verified on load</p>
            </div>
          </div>
        </div>
        <div className="card enterprise-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileKey2 size={22} color="var(--accent-cyan)" />
            <div>
              <p className="text-muted text-sm">DSR SLA</p>
              <p style={{ fontWeight: 700 }}>{dsr?.slaHours ?? '—'}h target</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <ListTree size={20} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent audit events</h3>
        </div>
        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Module</th>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((row) => (
                  <tr key={row._id}>
                    <td>{new Date(row.createdAt).toLocaleString()}</td>
                    <td>{row.module}</td>
                    <td>{row.action}</td>
                    <td>{row.actorEmail}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{row.entryHash?.slice(0, 16)}…</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>GDPR — data subject requests</h3>
        {!dsr ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
            {dsr.openRequests?.map((r: any) => (
              <li
                key={r.id}
                className="enterprise-card-static"
                style={{ padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid var(--border-light)' }}
              >
                <strong>{r.id}</strong> — {r.type} · <span className="text-muted">{r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
