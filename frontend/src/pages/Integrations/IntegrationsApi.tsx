import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Webhook, BookOpen, Plus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const IntegrationsApi = () => {
  const [spec, setSpec] = useState<any>(null);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [url, setUrl] = useState('https://example.com/hooks/amdox');
  const [events, setEvents] = useState('invoice.approved,inventory.low');

  const load = async () => {
    try {
      const [o, w] = await Promise.all([api.get('/integrations/openapi'), api.get('/integrations/webhooks')]);
      setSpec(o.data.data);
      setWebhooks(w.data.data.webhooks || []);
    } catch {
      toast.error('Failed to load integrations');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addHook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/integrations/webhooks', {
        url,
        events: events.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('Webhook registered (signed HMAC in production)');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not create webhook');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
          API gateway & webhooks
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
          Integrations <span className="text-gradient">fabric</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 640 }}>
          Versioned REST surface with OpenAPI 3.1 metadata (F-11). Outbound webhooks use HMAC signatures and exponential backoff
          retries in the full platform.
        </p>
      </motion.div>

      <div className="card enterprise-card-static">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <BookOpen size={20} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>OpenAPI bundle</h3>
        </div>
        {!spec ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <div style={{ fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>
            <p>
              <strong>{spec.title}</strong> · {spec.openapi} · {spec.version}
            </p>
            <p className="text-muted" style={{ marginTop: 8 }}>
              Base: <code>{spec.baseUrl}</code>
            </p>
            <ul style={{ marginTop: 12, paddingLeft: 18 }}>
              {spec.endpoints?.map((ep: string) => (
                <li key={ep} style={{ marginBottom: 4 }}>
                  <code>{ep}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Webhook size={20} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Webhook subscriptions</h3>
        </div>
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>URL</th>
                <th>Events</th>
                <th>Secret</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((h) => (
                <tr key={h.id}>
                  <td>{h.id}</td>
                  <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.url}</td>
                  <td>{(h.events || []).join(', ')}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{h.secretPreview}</td>
                  <td>{h.active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form onSubmit={addHook} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
          <label className="text-sm text-muted">
            Target URL
            <input className="input" style={{ marginTop: 6 }} value={url} onChange={(e) => setUrl(e.target.value)} />
          </label>
          <label className="text-sm text-muted">
            Events (comma-separated)
            <input className="input" style={{ marginTop: 6 }} value={events} onChange={(e) => setEvents(e.target.value)} />
          </label>
          <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
            <Plus size={18} /> Add webhook
          </button>
        </form>
      </div>
    </div>
  );
};
