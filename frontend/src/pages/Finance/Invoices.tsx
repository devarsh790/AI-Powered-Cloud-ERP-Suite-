import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
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
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
}

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
        const response = await axios.get('/api/finance/invoices', {
          params: { search, status: statusFilter !== 'all' ? statusFilter : undefined, page, limit: 20 },
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        return response?.data?.data ?? { data: [] };
      } catch (error) {
        console.error('Failed to fetch invoices', error);
        return { data: [] };
      }
    },
    initialData: { data: [] },
  });

  const sendMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.post(`/api/finance/invoices/${id}/send`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Invoice sent successfully');
      setShowDetail(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/finance/invoices/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
    },
    onSuccess: () => {
      toast.success('Invoice deleted');
      setShowDetail(false);
    },
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      partial: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-500',
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Invoices</h1>
          <p className="text-text-secondary mt-1">Manage customer invoices and track payments</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          New Invoice
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-text-dim" size={18} />
          <input
            type="text"
            placeholder="Search invoices, customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Table */}
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
            render: (val) => <span className="font-semibold">${(val / 100).toFixed(2)}</span>,
          },
          {
            key: 'amountPaid',
            label: 'Paid',
            align: 'right',
            render: (val) => <span className="text-success">${(val / 100).toFixed(2)}</span>,
          },
          {
            key: 'status',
            label: 'Status',
            render: (val) => (
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(val)}`}>
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
                className="p-2 hover:bg-surface-muted rounded transition-colors"
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

      {/* Invoice Detail Drawer */}
      {showDetail && selectedInvoice && (
        <InvoiceDetailDrawer
          invoice={selectedInvoice}
          onClose={() => setShowDetail(false)}
          onSend={() => sendMutation.mutate(selectedInvoice._id)}
          onDelete={() => deleteMutation.mutate(selectedInvoice._id)}
        />
      )}

      {/* New Invoice Modal */}
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
  const { data: details, isLoading } = useQuery({
    queryKey: ['invoice', invoice._id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/finance/invoices/${invoice._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        return response.data.data ?? invoice;
      } catch (error) {
        console.error('Failed to fetch invoice details', error);
        return invoice;
      }
    },
  });

  const remaining = (details?.total || 0) - (details?.amountPaid || 0);

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="w-96 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-bold">{invoice.invoiceNumber}</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-muted rounded">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-surface-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Customer Info */}
              <div>
                <p className="text-xs text-text-dim uppercase font-semibold mb-1">Customer</p>
                <p className="font-medium text-text-primary">{details?.customerName}</p>
                <p className="text-sm text-text-secondary">{details?.customerEmail}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-dim uppercase font-semibold mb-1">Issue Date</p>
                  <p className="text-sm text-text-primary">{new Date(details?.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-dim uppercase font-semibold mb-1">Due Date</p>
                  <p className="text-sm text-text-primary">{new Date(details?.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Amounts */}
              <div className="bg-surface-muted rounded p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="text-text-primary font-medium">${(details?.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tax:</span>
                  <span className="text-text-primary font-medium">${(details?.taxAmount / 100).toFixed(2)}</span>
                </div>
                <div className="border-t border-border-light pt-2 flex justify-between">
                  <span className="font-semibold text-text-primary">Total:</span>
                  <span className="font-bold text-lg text-primary">${(details?.total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Paid:</span>
                  <span className="text-success font-medium">${(details?.amountPaid / 100).toFixed(2)}</span>
                </div>
                {remaining > 0 && (
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-text-primary">Remaining:</span>
                    <span className="text-danger">${(remaining / 100).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-text-dim uppercase font-semibold mb-2">Status</p>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded inline-block ${
                    details?.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}
                >
                  {details?.status.toUpperCase()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-border-light p-4 space-y-2">
          {details?.status === 'draft' && (
            <>
              <button
                onClick={onSend}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Send size={16} />
                Send Invoice
              </button>
              <button
                onClick={onDelete}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-danger text-danger rounded-lg hover:bg-danger/10 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-border-light rounded-lg hover:bg-surface-muted transition-colors"
          >
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
      await axios.post('/api/finance/invoices', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
    },
    onSuccess,
  });

  const handleLineItemChange = (idx: number, field: string, value: any) => {
    const newItems = [...formData.lineItems];
    newItems[idx] = { ...newItems[idx], [field]: value };

    // Recalculate total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[idx].total = newItems[idx].quantity * newItems[idx].unitPrice;
    }

    setFormData({ ...formData, lineItems: newItems });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-2xl font-bold">Create Invoice</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-muted rounded">
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="col-span-2 px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="email"
              placeholder="Customer Email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="col-span-2 px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="col-span-2 px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Line Items */}
          <div>
            <h3 className="font-semibold mb-2">Line Items</h3>
            {formData.lineItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                  className="col-span-2 px-2 py-1 text-sm border border-border-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(idx, 'quantity', parseFloat(e.target.value))}
                  className="px-2 py-1 text-sm border border-border-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => handleLineItemChange(idx, 'unitPrice', parseFloat(e.target.value))}
                  className="px-2 py-1 text-sm border border-border-light rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-light rounded-lg hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {mutation.isPending ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
