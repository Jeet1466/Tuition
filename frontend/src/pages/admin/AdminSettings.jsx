import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { admin, authFetch } = useAuth();
  const [form, setForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [alert, setAlert]   = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const showAlert = (type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert({ type: '', msg: '' }), 4000); };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showAlert('error', 'New passwords do not match.');
      return;
    }
    if (form.newPassword.length < 6) {
      showAlert('error', 'New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    const res = await authFetch('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    });
    if (res.ok) {
      showAlert('success', 'Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      const err = await res.json();
      showAlert('error', err.error || 'Failed to change password.');
    }
    setSaving(false);
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>⚙️ Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>Manage your admin account settings.</p>
      </div>

      <div style={{ maxWidth: 600 }}>
        {/* Account Info */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header"><span className="admin-card-title">Account Information</span></div>
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: '#fff' }}>
                {admin?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--color-primary)' }}>{admin?.username}</div>
                <div style={{ fontSize: 13, color: 'var(--color-on-surface-var)' }}>Administrator · Full Access</div>
              </div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px 20px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 13, color: 'var(--color-on-surface-var)', lineHeight: 1.6 }}>
                You have full admin access to manage results, enrollments, testimonials, batches, and contact messages.
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Change Password</span></div>
          <div style={{ padding: '20px 24px' }}>
            {alert.msg && (
              <div className={`admin-alert admin-alert-${alert.type}`} style={{ marginBottom: 20 }}>
                {alert.type === 'success' ? '✅' : '⚠️'} {alert.msg}
              </div>
            )}
            <form onSubmit={handleChangePassword}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Current Password</label>
                  <input type="password" className="admin-form-input" required value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} placeholder="Enter current password" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">New Password</label>
                  <input type="password" className="admin-form-input" required value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Min. 6 characters" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Confirm New Password</label>
                  <input type="password" className="admin-form-input" required value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Repeat new password" />
                </div>
                <button type="submit" className="action-btn action-btn-primary" style={{ padding: '12px 24px', fontSize: 14, alignSelf: 'flex-start' }} disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
