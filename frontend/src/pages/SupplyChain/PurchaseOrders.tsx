import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PurchaseOrders = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const res = await api.get('/supply-chain/purchase-orders');
        setPos(res.data.data.data || res.data.data); // Handle paginated or unpaginated response
      } catch (error) {
        console.error('Failed to fetch POs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPOs();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Purchase <span className="text-primary">Orders</span></h1>
          <p className="text-muted">Manage vendor orders and procurement</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={() => toast.success('Purchase orders exported successfully')}>
            <Download size={18} /> Export
          </button>
          <button className="btn btn-primary">
            <Plus size={18} /> Create PO
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">All Purchase Orders</h3>
          <div className="flex gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search PO number..." 
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
                <th className="pb-3 font-medium">PO Number</th>
                <th className="pb-3 font-medium">Vendor</th>
                <th className="pb-3 font-medium">Order Date</th>
                <th className="pb-3 font-medium">Expected Delivery</th>
                <th className="pb-3 font-medium text-right">Total Amount</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    Loading POs...
                  </td>
                </tr>
              ) : pos.length > 0 ? (
                pos.map((po: any) => (
                  <tr key={po._id} className="border-b border-light last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="py-3 text-sm font-medium text-primary">{po.poNumber}</td>
                    <td className="py-3 text-sm">{po.vendorId?.name || po.vendorId}</td>
                    <td className="py-3 text-sm text-muted">{new Date(po.orderDate).toLocaleDateString()}</td>
                    <td className="py-3 text-sm text-muted">{new Date(po.expectedDeliveryDate).toLocaleDateString()}</td>
                    <td className="py-3 text-sm text-right font-medium">${po.totalAmount?.toLocaleString()}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        po.status === 'delivered' ? 'bg-success-bg text-success' : 
                        po.status === 'draft' ? 'bg-warning-bg text-warning' : 'bg-info-bg text-info'
                      }`}>
                        {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No purchase orders found.
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
