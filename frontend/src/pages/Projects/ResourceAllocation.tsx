import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users2, Briefcase } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ResourceAllocation = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const [e, p] = await Promise.all([
          api.get('/hr/employees', { params: { limit: 100 } }),
          api.get('/projects', { params: { limit: 50 } }),
        ]);
        setEmployees(e.data.data || []);
        setProjects(p.data.data || []);
      } catch {
        toast.error('Failed to load allocation data');
      }
    };
    run();
  }, []);

  const rows = employees.slice(0, 12).map((emp, i) => {
    const proj = projects[i % Math.max(projects.length, 1)] || null;
    const util = 65 + ((i * 7) % 30);
    return { emp, proj, util };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
          Resource allocation
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
          Capacity <span className="text-gradient">heatmap</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 600 }}>
          Assign people to delivery workstreams (F-07). Utilisation below is illustrative; production uses task-level assignments
          and DAG validation.
        </p>
      </motion.div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Users2 size={20} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Rolling allocation</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Department</th>
                <th>Primary project</th>
                <th>Utilisation</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ emp, proj, util }) => (
                <tr key={emp._id}>
                  <td>
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td>{emp.department}</td>
                  <td>
                    {proj ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Briefcase size={14} /> {proj.name}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, maxWidth: 120, height: 8, background: 'var(--border-light)', borderRadius: 4 }}>
                        <div
                          style={{
                            width: `${util}%`,
                            height: '100%',
                            borderRadius: 4,
                            background:
                              util > 90 ? 'var(--danger)' : util > 75 ? 'var(--warning)' : 'var(--success)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{util}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
