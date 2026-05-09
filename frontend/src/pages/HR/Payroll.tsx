import React, { useEffect, useState } from 'react';
import { Play, Search, Filter, Download, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchPayrolls = async () => {
    try {
      const res = await api.get('/hr/payroll');
      setPayrolls(res.data.data);
    } catch (error) {
      console.error('Failed to fetch payrolls', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleRunPayroll = async () => {
    setRunning(true);
    try {
      const today = new Date();
      await api.post('/hr/payroll/run', { month: today.getMonth() + 1, year: today.getFullYear() });
      toast.success('Payroll processed successfully');
      fetchPayrolls();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process payroll');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Payroll Management</h1>
          <p className="text-muted">Process salaries, deductions, and payslips</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Download size={18} /> Export Reports
          </button>
          <button className="btn btn-primary" onClick={handleRunPayroll} disabled={running}>
            <Play size={18} /> {running ? 'Processing...' : 'Run Payroll'}
          </button>
        </div>
      </div>

      <div className="dashboard-grid mb-2">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Total Payroll (YTD)</p>
              <h3 className="text-2xl font-bold text-main">$1,245,000</h3>
            </div>
            <div className="p-2 rounded-lg bg-primary bg-opacity-10 text-primary">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Next Run Date</p>
              <h3 className="text-2xl font-bold text-main">Oct 30, 2026</h3>
            </div>
            <div className="p-2 rounded-lg bg-info bg-opacity-10 text-info">
              <Calendar size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Avg Salary / Emp</p>
              <h3 className="text-2xl font-bold text-main">$8,400</h3>
            </div>
            <div className="p-2 rounded-lg bg-success bg-opacity-10 text-success">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Payroll History</h3>
          <div className="flex gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search records..." 
                className="input-field pl-9 py-1.5 text-sm w-64"
              />
            </div>
            <button className="btn btn-secondary py-1.5">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-light text-muted text-sm">
                <th className="pb-3 font-medium">Employee</th>
                <th className="pb-3 font-medium">Period</th>
                <th className="pb-3 font-medium text-right">Gross Pay</th>
                <th className="pb-3 font-medium text-right">Deductions</th>
                <th className="pb-3 font-medium text-right">Net Pay</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    Loading payroll...
                  </td>
                </tr>
              ) : payrolls.length > 0 ? (
                payrolls.map((pay: any) => (
                  <tr key={pay._id} className="border-b border-light last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="py-3">
                      <p className="text-sm font-medium text-main">{pay.employeeId?.firstName} {pay.employeeId?.lastName}</p>
                      <p className="text-xs text-muted">{pay.employeeId?.department}</p>
                    </td>
                    <td className="py-3 text-sm text-muted">{pay.month}/{pay.year}</td>
                    <td className="py-3 text-sm text-right">${pay.grossPay?.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right text-danger">-${pay.totalDeductions?.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right font-bold text-success">${pay.netPay?.toLocaleString()}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        pay.status === 'processed' || pay.status === 'paid' ? 'bg-success-bg text-success' : 
                        pay.status === 'draft' ? 'bg-warning-bg text-warning' : 'bg-danger-bg text-danger'
                      }`}>
                        {pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No payroll records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
