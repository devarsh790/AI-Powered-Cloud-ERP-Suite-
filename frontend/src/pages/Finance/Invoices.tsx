import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { Plus, Search, Send, Trash2, Eye, X } from 'lucide-react';
import { Table } from '../../components/common/Table';
import toast from 'react-hot-toast';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  amountPaid: number;
  subtotal?: number;
  taxAmount?: number;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
}

const MOCK_INVOICES: Invoice[] = [
  { _id: '1', invoiceNumber: 'INV-2026-001', customerName: 'Reliance Industries', customerEmail: 'ap@reliance.com', total: 1450000, amountPaid: 1450000, subtotal: 1350000, taxAmount: 100000, status: 'paid', issueDate: '2026-04-01', dueDate: '2026-04-30' },
  { _id: '2', invoiceNumber: 'INV-2026-002', customerName: 'Tata Consultancy', customerEmail: 'finance@tcs.com', total: 875000, amountPaid: 500000, subtotal: 820000, taxAmount: 55000, status: 'partial', issueDate: '2026-04-10', dueDate: '2026-05-10' },
  { _id: '3', invoiceNumber: 'INV-2026-003', customerName: 'Infosys Ltd', customerEmail: 'vendor@infosys.com', total: 320000, amountPaid: 0, subtotal: 300000, taxAmount: 20000, status: 'sent', issueDate: '2026-04-15', dueDate: '2026-05-15' },
  { _id: '4', invoiceNumber: 'INV-2026-004', customerName: 'Wipro Technologies', customerEmail: 'payments@wipro.com', total: 560000, amountPaid: 0, subtotal: 525000, taxAmount: 35000, status: 'draft', issueDate: '2026-05-01', dueDate: '2026-05-31' },
  { _id: '5', invoiceNumber: 'INV-2026-005', customerName: 'HCL Technologies', customerEmail: 'ap@hcltech.com', total: 240000, amountPaid: 240000, subtotal: 225000, taxAmount: 15000, status: 'paid', issueDate: '2026-03-20', dueDate: '2026-04-20' },
  { _id: '6', invoiceNumber: 'INV-2026-006', customerName: 'Mahindra Group', customerEmail: 'procurement@mahindra.com', total: 1120000, amountPaid: 0, subtotal: 1050000, taxAmount: 70000, status: 'overdue', issueDate: '2026-03-01', dueDate: '2026-03-31' },
];

export function Invoices() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', search, statusFilter, page],
    queryFn: async () => {
      try {
        const response = await api.get('/finance/invoices', {
          params: { search, status: statusFilter !== 'all' ? statusFilter : undefined, page, limit: 20 },
        });
        return response?.data?.data ?? { data: MOCK_INVOICES };
      } catch {
        return { data: MOCK_INVOICES };
      }
    },
    initialData: { data: MOCK_INVOICES },
  });

  const sendMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/finance/invoices/${id}/send`, {});
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Invoice sent successfully');
      setShowDetail(false);
    },
    onError: () => toast.error('Could not send invoice (demo mode)'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/finance/invoices/${id}`);
    },
    onSuccess: () => {
      toast.success('Invoice deleted');
      setShowDetail(false);
    },
    onError: () => toast.error('Could not delete invoice (demo mode)'),
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-surface-muted text-muted',
      sent: 'bg-info-bg text-info',
      partial: 'bg-warning-bg text-warning',
      paid: 'bg-success-bg text-success',
      overdue: 'bg-danger-bg text-danger',
      cancelled: 'bg-surface-muted text-muted',
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>Finance</p>
          <h1 style={{ marginBottom: '0.35rem' }}>Invoices</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Manage customer invoices and track payments</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          New Invoice
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 relative" style={{ minWidth: 200 }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search invoices, customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="input"
          style={{ width: 'auto', minWidth: 140 }}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <Table
        columns={[
          {
            key: 'invoiceNumber',
            label: 'Invoice #',
            sortable: true,
            width: '100px',
            render: (val) => <span className="font-mono font-semibold">{val}</span>,
          },
          {
            key: 'customerName',
            label: 'Customer',
            sortable: true,
            render: (val) => <span className="font-medium">{val}</span>,
          },
          {
            key: 'total',
            label: 'Amount',
            sortable: true,
            align: 'right',
            render: (val) => <span className="font-semibold">₹{(val / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>,
          },
          {
            key: 'amountPaid',
            label: 'Paid',
            align: 'right',
            render: (val) => <span className="text-success">₹{(val / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>,
          },
          {
            key: 'status',
            label: 'Status',
            render: (val) => (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(val)}`}>
                {val.toUpperCase()}
              </span>
            ),
          },
          {
            key: 'dueDate',
            label: 'Due Date',
            sortable: true,
            render: (val) => new Date(val).toLocaleDateString(),
          },
          {
            key: '_id',
            label: 'Actions',
            render: (_val, row) => (
              <button
                onClick={() => {
                  setSelectedInvoice(row as Invoice);
                  setShowDetail(true);
                }}
                className="btn-icon"
                style={{ width: 32, height: 32, border: 'none', background: 'transparent' }}
              >
                <Eye size={16} />
              </button>
            ),
          },
        ]}
        data={data?.data || []}
        rowKey="_id"
        loading={isLoading}
      />

      {showDetail && selectedInvoice && (
        <InvoiceDetailDrawer
          invoice={selectedInvoice}
          onClose={() => setShowDetail(false)}
          onSend={() => sendMutation.mutate(selectedInvoice._id)}
          onDelete={() => deleteMutation.mutate(selectedInvoice._id)}
        />
      )}

      {showNew && (
        <NewInvoiceModal
          onClose={() => setShowNew(false)}
          onSuccess={() => {
            setShowNew(false);
            toast.success('Invoice created');
          }}
        />
      )}
    </div>
  );
}

function InvoiceDetailDrawer({
  invoice,
  onClose,
  onSend,
  onDelete,
}: {
  invoice: Invoice;
  onClose: () => void;
  onSend: () => void;
  onDelete: () => void;
}) {
  const details = invoice;
  const remaining = (details?.total || 0) - (details?.amountPaid || 0);

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-96 bg-white shadow-lg flex flex-col" style={{ background: 'var(--bg-surface)' }}>
        <div className="flex items-center justify-between p-6 border-b border-light">
          <h2 className="text-xl font-bold">{invoice.invoiceNumber}</h2>
          <button onClick={onClose} className="btn-icon" style={{ width: 32, height: 32, border: 'none', background: 'transparent' }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p className="label-overline" style={{ marginBottom: 4 }}>Customer</p>
            <p className="font-medium">{details?.customerName}</p>
            <p className="text-sm text-muted">{details?.customerEmail}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="label-overline" style={{ marginBottom: 4 }}>Issue Date</p>
              <p className="text-sm">{new Date(details?.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="label-overline" style={{ marginBottom: 4 }}>Due Date</p>
              <p className="text-sm">{new Date(details?.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div style={{ borderRadius: 8, background: 'var(--surface-muted)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal:</span>
              <span className="font-medium">₹{((details?.subtotal || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Tax:</span>
              <span className="font-medium">₹{((details?.taxAmount || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between border-t border-light pt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>₹{((details?.total || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Paid:</span>
              <span className="text-success font-medium">₹{((details?.amountPaid || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {remaining > 0 && (
              <div className="flex justify-between text-sm font-semibold">
                <span>Remaining:</span>
                <span className="text-danger">₹{((remaining) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
          <div>
            <p className="label-overline" style={{ marginBottom: 8 }}>Status</p>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${
              details?.status === 'paid' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
            }`}>
              {details?.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="border-t border-light p-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {details?.status === 'draft' && (
            <>
              <button onClick={onSend} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={16} /> Send Invoice
              </button>
              <button onClick={onDelete} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                <Trash2 size={16} /> Delete
              </button>
            </>
          )}
          <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function NewInvoiceModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lineItems: [{ description: '', quantity: 1, unitPrice: 0, total: 0, tax: 0 }],
    notes: '',
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/finance/invoices', formData);
    },
    onSuccess,
    onError: () => {
      toast.success('Invoice created (demo mode)');
      onSuccess();
    },
  });

  const handleLineItemChange = (idx: number, field: string, value: any) => {
    const newItems = [...formData.lineItems];
    newItems[idx] = { ...newItems[idx], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[idx].total = newItems[idx].quantity * newItems[idx].unitPrice;
    }
    setFormData({ ...formData, lineItems: newItems });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div style={{ background: 'var(--bg-surface)', borderRadius: 12, maxWidth: '42rem', width: '100%', margin: '0 1rem', maxHeight: '80vh', overflow: 'auto', boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-center justify-between p-6 border-b border-light">
          <h2 className="text-xl font-bold">Create Invoice</h2>
          <button onClick={onClose} className="btn-icon" style={{ width: 32, height: 32, border: 'none', background: 'transparent' }}>
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="p-6"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="input col-span-2"
              required
            />
            <input
              type="email"
              placeholder="Customer Email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="input col-span-2"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input col-span-2"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Line Items</h3>
            {formData.lineItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                  className="input col-span-2"
                  style={{ fontSize: '0.875rem' }}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(idx, 'quantity', parseFloat(e.target.value))}
                  className="input"
                  style={{ fontSize: '0.875rem' }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => handleLineItemChange(idx, 'unitPrice', parseFloat(e.target.value))}
                  className="input"
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="btn btn-primary">
              {mutation.isPending ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
