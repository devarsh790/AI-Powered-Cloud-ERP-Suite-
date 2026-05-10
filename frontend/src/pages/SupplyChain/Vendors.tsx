import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Mail, MapPin } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Vendors = () => {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get('/supply-chain/vendors');
        setVendors(res.data.data || []);
      } catch {
        toast.error('Failed to load vendors');
      }
    };
    run();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
          Vendor master
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
          Supplier <span className="text-gradient">network</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 560 }}>
          Vendor portal APIs and PO notifications (F-05) integrate with BullMQ + SES for threshold breaches.
        </p>
      </motion.div>

      <div className="dashboard-grid">
        {vendors.map((v) => (
          <div key={v._id} className="card enterprise-card-static">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{v.name}</h3>
                <p className="text-muted text-sm">{v.vendorCode}</p>
              </div>
              <Truck size={22} color="var(--primary)" />
            </div>
            <div style={{ marginTop: 14, display: 'grid', gap: 8, fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} className="text-muted" />
                {v.email || '—'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} className="text-muted" />
                {[v.address?.city, v.address?.country].filter(Boolean).join(', ') || '—'}
              </div>
              <p>
                <span className="text-muted">Terms:</span> {v.paymentTerms || 'Net 30'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
