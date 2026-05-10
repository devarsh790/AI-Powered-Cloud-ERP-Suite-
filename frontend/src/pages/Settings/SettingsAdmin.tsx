import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, KeyRound, Bell, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsAdmin = () => {
  const [ssoAzure, setSsoAzure] = useState(true);
  const [ssoGoogle, setSsoGoogle] = useState(true);
  const [mfaEnforce, setMfaEnforce] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWebhook, setNotifyWebhook] = useState(true);

  const save = () => {
    toast.success('Tenant policies updated (demo — persists in full deployment)');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="label-overline" style={{ marginBottom: 8, color: 'var(--primary)' }}>
          Tenant administration
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.35rem' }}>
          Security & <span className="text-gradient">policies</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 620 }}>
          Multi-tenant auth with OIDC/SAML (F-01) maps to Keycloak realms in production. Preferences below mirror enterprise
          controls for MFA enforcement and IdP linkage.
        </p>
      </motion.div>

      <div className="dashboard-grid">
        <div className="card enterprise-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Building2 size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Identity providers</h3>
          </div>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Azure AD (SAML 2.0)</span>
            <input type="checkbox" checked={ssoAzure} onChange={(e) => setSsoAzure(e.target.checked)} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Google Workspace (OIDC)</span>
            <input type="checkbox" checked={ssoGoogle} onChange={(e) => setSsoGoogle(e.target.checked)} />
          </label>
        </div>

        <div className="card enterprise-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Shield size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Session & MFA</h3>
          </div>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Require MFA for all users</span>
            <input type="checkbox" checked={mfaEnforce} onChange={(e) => setMfaEnforce(e.target.checked)} />
          </label>
          <p className="text-muted text-sm" style={{ marginTop: 12 }}>
            Session timeout: 15 minutes idle · RS256 JWT validation on API gateway.
          </p>
        </div>

        <div className="card enterprise-card-static">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Bell size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Notification channels</h3>
          </div>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Email (SES)</span>
            <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Webhooks</span>
            <input type="checkbox" checked={notifyWebhook} onChange={(e) => setNotifyWebhook(e.target.checked)} />
          </label>
          <p className="text-muted text-sm">Per-user channel preferences (F-10) ship in the notification service.</p>
        </div>
      </div>

      <div className="card enterprise-card-static" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <KeyRound size={22} color="var(--primary)" />
        <p style={{ flex: 1, fontSize: '0.9375rem' }}>
          API keys and SCIM provisioning are disabled in this demo bundle — enable in staging with Vault-backed secrets.
        </p>
        <button type="button" className="btn btn-primary" onClick={save}>
          Save policies
        </button>
      </div>
    </div>
  );
};
