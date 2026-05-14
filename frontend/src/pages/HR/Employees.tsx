import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Download,
  Users as UsersIcon,
  UserCheck,
  UserMinus,
  Shield,
  MoreHorizontal,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MOCK_EMPLOYEES = [
  { _id: '1', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun.mehta@amdox.com', employeeId: 'EMP-001', department: 'Engineering', designation: 'Lead Engineer', employmentType: 'Full-time', status: 'active' },
  { _id: '2', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@amdox.com', employeeId: 'EMP-002', department: 'Finance', designation: 'Financial Analyst', employmentType: 'Full-time', status: 'active' },
  { _id: '3', firstName: 'Rahul', lastName: 'Patel', email: 'rahul.patel@amdox.com', employeeId: 'EMP-003', department: 'HR', designation: 'HR Manager', employmentType: 'Full-time', status: 'active' },
  { _id: '4', firstName: 'Aisha', lastName: 'Khan', email: 'aisha.khan@amdox.com', employeeId: 'EMP-004', department: 'Operations', designation: 'Operations Lead', employmentType: 'Full-time', status: 'active' },
  { _id: '5', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@amdox.com', employeeId: 'EMP-005', department: 'Engineering', designation: 'DevOps Engineer', employmentType: 'Full-time', status: 'active' },
  { _id: '6', firstName: 'Neha', lastName: 'Gupta', email: 'neha.gupta@amdox.com', employeeId: 'EMP-006', department: 'Product', designation: 'Product Manager', employmentType: 'Full-time', status: 'on-leave' },
  { _id: '7', firstName: 'Karan', lastName: 'Joshi', email: 'karan.joshi@amdox.com', employeeId: 'EMP-007', department: 'Sales', designation: 'Sales Executive', employmentType: 'Full-time', status: 'active' },
  { _id: '8', firstName: 'Divya', lastName: 'Nair', email: 'divya.nair@amdox.com', employeeId: 'EMP-008', department: 'Engineering', designation: 'QA Engineer', employmentType: 'Contract', status: 'active' },
];

export const Employees = () => {
  const [employees, setEmployees] = useState<any[]>(MOCK_EMPLOYEES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/hr/employees');
        if (res.data.data?.length) setEmployees(res.data.data);
      } catch {
        // Use mock data (already set as default)
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const stats = [
    { label: 'Total workforce', value: '124', icon: UsersIcon, color: 'var(--primary)' },
    { label: 'Active personnel', value: '118', icon: UserCheck, color: 'var(--success)' },
    { label: 'On leave / other', value: '6', icon: UserMinus, color: 'var(--warning)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.25rem' }}>
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
            Human resources
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
            Workforce <span className="text-primary">directory</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 520 }}>
            Govern roles, compliance, and organizational structure from a single enterprise view.
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={() => toast.success('Export downloaded successfully')}>
            <Download size={18} /> Export</button>
          <button type="button" className="btn btn-primary">
            <Plus size={18} /> Add employee
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="card card-kpi enterprise-card-static"
          >
            <p className="label-overline" style={{ marginBottom: 4 }}>
              {stat.label}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.75rem' }}>{stat.value}</h3>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'var(--surface-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-light)',
                  color: stat.color,
                }}
              >
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card enterprise-card-static"
        style={{ padding: '1.75rem' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)' }}>Active directory</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                className="nexus-input"
                placeholder="Search people, ID, or department…"
                style={{ paddingLeft: '2.75rem', width: 'min(320px, 100%)', height: 44 }}
              />
            </div>
            <button type="button" className="btn btn-secondary" style={{ height: 44 }}>
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                {['Identity', 'ID', 'Division', 'Role', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.85rem 1rem',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        border: '2px solid rgba(37, 99, 235, 0.2)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 0.9s linear infinite',
                        margin: '0 auto',
                      }}
                    />
                    <p className="label-overline" style={{ marginTop: 16 }}>
                      Loading directory
                    </p>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp: any, idx: number) => (
                  <motion.tr
                    key={emp._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    style={{ borderBottom: '1px solid var(--border-light)' }}
                    className="matrix-row"
                  >
                    <td style={{ padding: '1.1rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: 'linear-gradient(145deg, rgba(37,99,235,0.2), rgba(6,182,212,0.12))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-light)',
                          }}
                        >
                          {emp.firstName.charAt(0)}
                          {emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.1rem 1rem', fontSize: '0.875rem', fontFamily: 'ui-monospace, monospace', color: 'var(--text-dim)' }}>
                      {emp.employeeId}
                    </td>
                    <td style={{ padding: '1.1rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <Shield size={14} color="var(--primary)" />
                        {emp.department}
                      </div>
                    </td>
                    <td style={{ padding: '1.1rem 1rem' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{emp.designation}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{emp.employmentType}</p>
                    </td>
                    <td style={{ padding: '1.1rem 1rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '0.3rem 0.65rem',
                          borderRadius: 999,
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          background:
                            emp.status === 'active' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: emp.status === 'active' ? 'var(--success)' : 'var(--warning)',
                          border: `1px solid ${emp.status === 'active' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'currentColor',
                          }}
                        />
                        {String(emp.status).toUpperCase()}
                      </div>
                    </td>
                    <td style={{ padding: '1.1rem 1rem', textAlign: 'right' }}>
                      <button type="button" className="btn-icon" aria-label="Row actions">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No employees in this workspace.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      <style>{`
        .matrix-row:hover { background: var(--hover-surface) !important; }
      `}</style>
    </div>
  );
};
