import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download, ArrowDownRight, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Payables = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/finance/invoices?type=payable');
        setInvoices(res.data.data);
      } catch (error) {
        console.error('Failed to fetch payables', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Accounts <span className="text-primary">Payable</span></h1>
          <p className="text-muted">Manage vendor bills and outgoing payments</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={() => toast.success('Payables report exported successfully')}>
            <Download size={18} /> Export
          </button>
          <button className="btn btn-primary">
            <Plus size={18} /> Record Bill
          </button>
        </div>
      </div>

      <div className="dashboard-grid mb-2">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Total Outstanding</p>
              <h3 className="text-2xl font-bold text-main">$9,180</h3>
            </div>
            <div className="p-2 rounded-lg bg-warning bg-opacity-10 text-warning">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Paid This Month</p>
              <h3 className="text-2xl font-bold text-main">$13,500</h3>
            </div>
            <div className="p-2 rounded-lg bg-success bg-opacity-10 text-success">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Overdue Bills</p>
              <h3 className="text-2xl font-bold text-danger">$0</h3>
            </div>
            <div className="p-2 rounded-lg bg-danger bg-opacity-10 text-danger">
              <ArrowDownRight size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Vendor Bills</h3>
          <div className="flex gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search bills..." 
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
                <th className="pb-3 font-medium">Bill No.</th>
                <th className="pb-3 font-medium">Vendor</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Due Date</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    Loading bills...
                  </td>
                </tr>
              ) : invoices.length > 0 ? (
                invoices.map((inv: any) => (
                  <tr key={inv._id} className="border-b border-light last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="py-3 text-sm font-medium text-primary">{inv.invoiceNumber}</td>
                    <td className="py-3 text-sm">{inv.vendorOrCustomer}</td>
                    <td className="py-3 text-sm text-muted">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="py-3 text-sm text-muted">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 text-sm text-right font-medium">${inv.totalAmount.toLocaleString()}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        inv.status === 'paid' ? 'bg-success-bg text-success' : 
                        inv.status === 'pending' ? 'bg-warning-bg text-warning' : 
                        inv.status === 'overdue' ? 'bg-danger-bg text-danger' : 'bg-info-bg text-info'
                      }`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No vendor bills found.
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
