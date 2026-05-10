import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, Send } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const LeaveManagement = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({
    employeeId: '',
    type: 'annual',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
  });

  const load = async () => {
    try {
      const [l, e] = await Promise.all([api.get('/hr/leaves'), api.get('/hr/employees', { params: { limit: 100 } })]);
      setLeaves(l.data.data || []);
      const em = e.data.data || [];
      setEmployees(em);
      if (!form.employeeId && em[0]?._id) setForm((f) => ({ ...f, employeeId: em[0]._id }));
    } catch {
      toast.error('Failed to load leave data');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/hr/leaves', {
        ...form,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
      });
      toast.success('Leave request submitted');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
          Leave management
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
          Time away <span className="text-gradient">governance</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 560 }}>
          Accrual rules and approval workflows (F-04). Approvers use role-gated status transitions on the API.
        </p>
      </motion.div>

      <div className="dashboard-grid">
        <form className="card" onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarRange size={18} /> New request
          </h3>
          <label className="text-sm text-muted">
            Employee
            <select
              className="input"
              style={{ marginTop: 6 }}
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            >
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-muted">
            Type
            <select
              className="input"
              style={{ marginTop: 6 }}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {['annual', 'sick', 'casual', 'maternity', 'paternity', 'unpaid'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="text-sm text-muted">
              Start
              <input
                type="date"
                className="input"
                style={{ marginTop: 6 }}
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </label>
            <label className="text-sm text-muted">
              End
              <input
                type="date"
                className="input"
                style={{ marginTop: 6 }}
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </label>
          </div>
          <label className="text-sm text-muted">
            Days
            <input
              type="number"
              min={1}
              className="input"
              style={{ marginTop: 6 }}
              value={form.days}
              onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
            />
          </label>
          <label className="text-sm text-muted">
            Reason
            <input
              className="input"
              style={{ marginTop: 6 }}
              required
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
            <Send size={18} /> Submit
          </button>
        </form>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Pipeline</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((lv) => (
                  <tr key={lv._id}>
                    <td>
                      {lv.employeeId?.firstName} {lv.employeeId?.lastName}
                    </td>
                    <td>{lv.type}</td>
                    <td>
                      {new Date(lv.startDate).toLocaleDateString()} – {new Date(lv.endDate).toLocaleDateString()}
                    </td>
                    <td>{lv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
