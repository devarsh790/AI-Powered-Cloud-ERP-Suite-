import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password, tenantSlug: tenantSlug || undefined });
      toast.success('Enterprise Authorization Successful');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Access Denied: Invalid Credentials');
    }
  };

  const trustPoints = [
    'Tenant-scoped workspaces with isolated data planes',
    'Encryption in transit; session-bound credentials',
    'Audit-ready sign-in events and policy hooks',
  ];

  return (
    <div className="login-layout login-split">
      <aside className="login-brand-aside" aria-label="Product information">
        <div className="login-brand-inner">
          <Link to="/" className="login-brand-logo" style={{ padding: 0 }}>
            <img
              src="/logo.jfif"
              alt="Amdox"
              style={{
                height: 64,
                width: 'auto',
                filter: 'drop-shadow(0 4px 12px rgba(230, 74, 25, 0.15))',
              }}
              decoding="async"
            />
          </Link>
          <h1 className="login-brand-title">Sign in to your operations core</h1>
          <p className="login-brand-lede">
            One surface for finance, people, inventory, and delivery — with the same discipline you expect from industrial
            software.
          </p>
          <ul className="login-trust-list">
            {trustPoints.map((text) => (
              <li key={text}>
                <CheckCircle2 className="login-trust-icon" size={18} strokeWidth={2} aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="login-brand-footer">
          <Link to="/">← Back to overview</Link>
          <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>·</span>
          Need access? Contact your tenant admin.
        </p>
      </aside>

      <div className="login-auth-aside">
        <motion.div
          className="login-form-surface"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="login-session-pill" role="status">
            <span aria-hidden />
            Secure channel
          </div>

          <h2 style={{ fontSize: '1.625rem', marginBottom: '0.35rem' }}>Welcome back</h2>
          <p style={{ fontSize: '0.9375rem', marginBottom: '2rem' }}>Use your workspace identity to continue.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.5px',
                }}
              >
                Workspace
              </label>
              <div style={{ position: 'relative' }}>
                <Building2
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                  }}
                  size={16}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="enterprise-id"
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.5px',
                }}
              >
                Identity
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                  }}
                  size={16}
                />
                <input
                  type="email"
                  className="input"
                  placeholder="agent@amdox.corp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Passkey
                </label>
                <button type="button" className="btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                  Forgot?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                  }}
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-icon"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.35rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 36,
                    height: 36,
                    border: 'none',
                    background: 'transparent',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', height: '52px', marginTop: '0.25rem', justifyContent: 'center' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Authorize access
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800 }}>
              Other gateways
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
          </div>

          <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" style={{ padding: '0.75rem', fontSize: '0.8125rem', justifyContent: 'center' }}>
              <Globe size={16} color="var(--primary)" />
              SSO
            </button>
            <button type="button" className="btn btn-secondary" style={{ padding: '0.75rem', fontSize: '0.8125rem', justifyContent: 'center' }}>
              <ShieldCheck size={16} color="var(--success)" />
              IAM
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Demo: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>admin@amdox.com</span> /{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Admin@123</span>
            <span style={{ display: 'block', marginTop: 6 }}>OIDC/SAML via Azure AD or Google (F-01) wires to IdP in production.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
