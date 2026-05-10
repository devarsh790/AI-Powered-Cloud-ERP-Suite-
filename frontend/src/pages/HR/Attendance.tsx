import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3, LogIn, LogOut } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Attendance = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState('');

  const load = async () => {
    try {
      const [e, a] = await Promise.all([
        api.get('/hr/employees', { params: { limit: 100 } }),
        api.get('/hr/attendance', { params: { month: new Date().getMonth() + 1, year: new Date().getFullYear() } }),
      ]);
      const em = e.data.data || [];
      setEmployees(em);
      setRecords(a.data.data || []);
      if (!employeeId && em[0]?._id) setEmployeeId(em[0]._id);
    } catch {
      toast.error('Failed to load attendance');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clockIn = async () => {
    try {
      await api.post('/hr/attendance/clock-in', { employeeId });
      toast.success('Clock-in recorded');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Clock-in failed');
    }
  };

  const clockOut = async () => {
    try {
      await api.post('/hr/attendance/clock-out', { employeeId });
      toast.success('Clock-out recorded');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Clock-out failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
          Attendance
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
          Time capture & <span className="text-gradient">overtime</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 560 }}>
          Clock events feed the payroll engine (F-04). Overtime rules are applied server-side on clock-out.
        </p>
      </motion.div>

      <div className="card enterprise-card-static" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
        <label className="text-sm text-muted">
          Employee
          <select className="input" style={{ marginTop: 6, minWidth: 220 }} value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-primary" onClick={clockIn}>
          <LogIn size={18} /> Clock in
        </button>
        <button type="button" className="btn btn-secondary" onClick={clockOut}>
          <LogOut size={18} /> Clock out
        </button>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock3 size={18} /> This month
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>In</th>
                <th>Out</th>
                <th>Hours</th>
                <th>OT</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>
                    {r.employeeId?.firstName} {r.employeeId?.lastName}
                  </td>
                  <td>{r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : '—'}</td>
                  <td>{r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : '—'}</td>
                  <td>{r.hoursWorked?.toFixed?.(2) ?? r.hoursWorked}</td>
                  <td>{r.overtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
