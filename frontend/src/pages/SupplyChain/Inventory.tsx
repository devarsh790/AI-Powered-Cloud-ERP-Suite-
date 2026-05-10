import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download, PackageSearch, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get('/supply-chain/inventory');
        setItems(res.data.data);
      } catch (error) {
        console.error('Failed to fetch inventory', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Inventory Control</h1>
          <p className="text-muted">Manage products, stock levels, and warehouses</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Download size={18} /> Export
          </button>
          <button className="btn btn-primary">
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      <div className="dashboard-grid mb-2">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Total Items</p>
              <h3 className="text-2xl font-bold text-main">{items.length}</h3>
            </div>
            <div className="p-2 rounded-lg bg-primary bg-opacity-10 text-primary">
              <PackageSearch size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">In Stock</p>
              <h3 className="text-2xl font-bold text-success">{items.filter((i: any) => i.status === 'in-stock').length}</h3>
            </div>
            <div className="p-2 rounded-lg bg-success bg-opacity-10 text-success">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-warning">{items.filter((i: any) => i.status === 'low-stock').length}</h3>
            </div>
            <div className="p-2 rounded-lg bg-warning bg-opacity-10 text-warning">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Product Catalog</h3>
          <div className="flex gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search SKU or Name..." 
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
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Product Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Cost Price</th>
                <th className="pb-3 font-medium text-right">Selling Price</th>
                <th className="pb-3 font-medium text-right">Stock</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    Loading inventory...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item: any) => (
                  <tr key={item._id} className="border-b border-light last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="py-3 text-sm font-medium text-primary">{item.sku}</td>
                    <td className="py-3 text-sm font-medium">{item.name}</td>
                    <td className="py-3 text-sm text-muted">{item.category}</td>
                    <td className="py-3 text-sm text-right">${item.costPrice?.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right">${item.sellingPrice?.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right font-medium">
                      {item.currentStock} <span className="text-muted text-xs font-normal">{item.unit}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'in-stock' ? 'bg-success-bg text-success' : 
                        item.status === 'low-stock' ? 'bg-warning-bg text-warning' : 'bg-danger-bg text-danger'
                      }`}>
                        {item.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No inventory items found.
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
