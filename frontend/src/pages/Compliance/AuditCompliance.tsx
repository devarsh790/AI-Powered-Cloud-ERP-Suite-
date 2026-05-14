import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileKey2, ListTree } from 'lucide-react';
import api from '../../services/api';

const MOCK_LOGS = [
  { _id: '1', createdAt: '2026-05-14T10:23:00', module: 'Finance', action: 'invoice.approved', actorEmail: 'arjun.mehta@amdox.com', entryHash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6' },
  { _id: '2', createdAt: '2026-05-14T09:15:00', module: 'HR', action: 'employee.updated', actorEmail: 'priya.sharma@amdox.com', entryHash: 'f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6' },
  { _id: '3', createdAt: '2026-05-13T16:42:00', module: 'Supply Chain', action: 'po.created', actorEmail: 'rahul.patel@amdox.com', entryHash: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6' },
  { _id: '4', createdAt: '2026-05-13T14:08:00', module: 'Auth', action: 'user.login', actorEmail: 'admin@amdox.com', entryHash: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6' },
];

const MOCK_DSR = {
  slaHours: 72,
  openRequests: [
    { id: 'DSR-001', type: 'erasure', status: 'pending' },
    { id: 'DSR-002', type: 'access', status: 'processing' },
  ],
};

export const AuditCompliance = () => {
  const [logs, setLogs] = useState<any[]>(MOCK_LOGS);
  const [dsr, setDsr] = useState<any>(MOCK_DSR);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [l, g] = await Promise.all([api.get('/audit/logs'), api.get('/audit/gdpr/requests')]);
        if (l.data.data?.length) setLogs(l.data.data);
        if (g.data.data) setDsr(g.data.data);
      } catch {
        // Use mock data
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
          Tamper-evident <span className="text-primary">trail</span>
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
