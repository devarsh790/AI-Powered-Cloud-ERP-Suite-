import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const MOCK_INVOICES = [
  { _id: '1', type: 'receivable', invoiceNumber: 'INV-2026-001', vendorOrCustomer: 'Reliance Industries', dueDate: '2026-05-30', totalAmount: 450000, status: 'pending' },
  { _id: '2', type: 'receivable', invoiceNumber: 'INV-2026-002', vendorOrCustomer: 'Tata Consultancy', dueDate: '2026-04-10', totalAmount: 320000, status: 'pending' },
  { _id: '3', type: 'receivable', invoiceNumber: 'INV-2026-003', vendorOrCustomer: 'Infosys Ltd', dueDate: '2026-03-15', totalAmount: 180000, status: 'overdue' },
  { _id: '4', type: 'receivable', invoiceNumber: 'INV-2026-004', vendorOrCustomer: 'HCL Technologies', dueDate: '2026-02-01', totalAmount: 95000, status: 'overdue' },
  { _id: '5', type: 'receivable', invoiceNumber: 'INV-2026-005', vendorOrCustomer: 'Wipro', dueDate: '2026-04-30', totalAmount: 240000, status: 'paid' },
];

function bucket(days: number) {
  if (days <= 0) return 'current';
  if (days <= 30) return '1–30';
  if (days <= 60) return '31–60';
  return '60+';
}

export const FinanceReports = () => {
  const [invoices, setInvoices] = useState<any[]>(MOCK_INVOICES);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get('/finance/invoices', { params: { limit: 200 } });
        if (res.data.data?.length) setInvoices(res.data.data);
      } catch {
        // Use mock data
      }
    };
    run();
  }, []);

  const today = new Date();
  const ar = invoices.filter((i) => i.type === 'receivable');
  const aging = { current: 0, '1–30': 0, '31–60': 0, '60+': 0 };
  ar.forEach((inv) => {
    if (inv.status === 'paid') return;
    const due = new Date(inv.dueDate);
    const days = Math.floor((today.getTime() - due.getTime()) / 86400000);
    const b = bucket(days);
    aging[b as keyof typeof aging] += inv.totalAmount || 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
          Finance reporting
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
          AR aging & <span className="text-primary">exposure</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 560 }}>
          Scheduled board packs and drill-down (F-03 / F-08). Amounts reflect open receivables by overdue bucket.
        </p>
      </motion.div>

      <div className="dashboard-grid">
        {Object.entries(aging).map(([k, v]) => (
          <div key={k} className="card enterprise-card-static">
            <p className="text-muted text-sm">{k === 'current' ? 'Not due' : `Days ${k}`}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 6 }}>
              {v.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <FileBarChart size={20} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Open receivables</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ar
                .filter((i) => i.status !== 'paid')
                .map((inv) => {
                  const due = new Date(inv.dueDate);
                  const days = Math.floor((today.getTime() - due.getTime()) / 86400000);
                  const warn = days > 0;
                  return (
                    <tr key={inv._id}>
                      <td>{inv.invoiceNumber}</td>
                      <td>{inv.vendorOrCustomer}</td>
                      <td>
                        {due.toLocaleDateString()}
                        {warn && (
                          <AlertTriangle
                            size={14}
                            style={{ marginLeft: 6, verticalAlign: 'middle', color: 'var(--warning)' }}
                            aria-label="Overdue"
                          />
                        )}
                      </td>
                      <td>{inv.totalAmount?.toLocaleString?.() ?? inv.totalAmount}</td>
                      <td>{inv.status}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
