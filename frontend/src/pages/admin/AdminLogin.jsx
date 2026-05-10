import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-sidebar-logo-icon" style={{ width: 44, height: 44, fontSize: 20 }}>EM</div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17, color: 'var(--color-primary)' }}>
              Educating Minds
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-secondary)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Admin Panel
            </div>
          </div>
        </div>

        <h1 className="admin-login-title">Welcome Back</h1>
        <p className="admin-login-sub">Sign in to manage your academic hub.</p>

        {error && (
          <div className="admin-alert admin-alert-error" style={{ marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label className="admin-form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="admin-form-input"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
            />
          </div>
          <div className="admin-form-group" style={{ marginBottom: 24 }}>
            <label className="admin-form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="admin-form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In to Admin Panel →'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--color-on-surface-var)' }}>
          Default credentials: <strong>admin</strong> / <strong>admin123</strong>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
