import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password, tenantSlug: tenantSlug || undefined });
      toast.success('Welcome back to the Nexus!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-layout">
      {/* Animated Futuristic Background */}
      <div className="login-background">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="login-card-container"
      >
        <div className="glass-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {/* You could replace this with a futuristic neon logo SVG */}
            <h1 className="text-neon" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '2px' }}>
              AMDOX
            </h1>
            <p className="text-muted" style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              Secure Nexus Access
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group mb-4">
              <label className="form-label">Workspace Node (Optional)</label>
              <div className="input-icon-wrapper">
                <Building2 className="icon" size={18} />
                <input
                  type="text"
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  placeholder="company-id"
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Identity Hash (Email)</label>
              <div className="input-icon-wrapper">
                <Mail className="icon" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@nexus.net"
                />
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Access Key (Password)</label>
              <div className="input-icon-wrapper">
                <Lock className="icon" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading} 
              className="btn btn-primary w-full"
              style={{ padding: '1rem', marginTop: '0.5rem' }}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'INITIALIZE LINK'}
            </motion.button>
          </form>

          <p className="text-muted mt-8 text-center" style={{ fontSize: '0.8rem' }}>
            Protocol demo: admin@amdox.com / password
          </p>
        </div>
      </motion.div>
    </div>
  );
};
