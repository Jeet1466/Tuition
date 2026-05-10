import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#00235A', '#FF5E14', '#03EC8D', '#1a4a8a', '#cc4a0f', '#00874f', '#7c3aed', '#db2777'];
const BLANK = { quote: '', name: '', grade: '', initials: '', color: '#00235A', stars: 5, active: 1 };

export default function AdminTestimonials() {
  const { authFetch } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);
  const [alert,   setAlert]   = useState('');
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const load = () => authFetch('/api/testimonials/all').then(r => r.json()).then(setTestimonials).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (t) => {
    setEditing(t.id);
    setForm({ quote: t.quote, name: t.name, grade: t.grade, initials: t.initials, color: t.color, stars: t.stars, active: t.active });
    setModal(true);
  };

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url    = editing ? `/api/testimonials/${editing}` : '/api/testimonials';
    const method = editing ? 'PUT' : 'POST';
    const res = await authFetch(url, { method, body: JSON.stringify(form) });
    if (res.ok) { setModal(false); load(); showAlert(editing ? 'Testimonial updated!' : 'Testimonial added!'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    await authFetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    load();
    showAlert('Testimonial deleted.');
  };

  const toggleActive = async (t) => {
    await authFetch(`/api/testimonials/${t.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...t, active: t.active ? 0 : 1 }),
    });
    load();
  };

  return (
    <>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>💬 Testimonials</h1>
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>Manage student and parent testimonials shown on the website.</p>
        </div>
        <button className="action-btn action-btn-primary" style={{ padding: '12px 20px', fontSize: 14 }} onClick={openAdd}>
          + Add Testimonial
        </button>
      </div>

      {alert && <div className="admin-alert admin-alert-success">✅ {alert}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {loading ? (
          <div style={{ padding: 40, gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-on-surface-var)', fontSize: 14 }}>Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="admin-empty" style={{ gridColumn: '1/-1' }}>
            <div className="admin-empty-icon">💬</div>
            <div className="admin-empty-title">No testimonials yet</div>
          </div>
        ) : testimonials.map(t => (
          <div key={t.id} className="admin-card" style={{ opacity: t.active ? 1 : 0.6 }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ color: '#f59e0b', fontSize: 16 }}>{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
                <span
                  className="status-badge"
                  style={{ background: t.active ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)', color: t.active ? '#047857' : '#374151' }}
                >
                  {t.active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--color-on-surface)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 16 }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--color-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-on-surface-var)' }}>{t.grade}</div>
                </div>
              </div>
              <div className="btn-actions" style={{ marginTop: 16, borderTop: '1px solid #f0f2f5', paddingTop: 14 }}>
                <button className="action-btn action-btn-outline" style={{ fontSize: 11 }} onClick={() => openEdit(t)}>✏️ Edit</button>
                <button className="action-btn action-btn-outline" style={{ fontSize: 11 }} onClick={() => toggleActive(t)}>
                  {t.active ? '🙈 Hide' : '👁 Show'}
                </button>
                <button className="action-btn action-btn-danger" style={{ fontSize: 11 }} onClick={() => handleDelete(t.id)}>🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <h2 className="admin-modal-title">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <p className="admin-modal-sub">Add a testimonial from a student or parent.</p>
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Quote / Review *</label>
                  <textarea className="admin-form-input" required rows={4} value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} placeholder="Enter the testimonial text..." />
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Name *</label>
                    <input className="admin-form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, initials: e.target.value.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase() }))} placeholder="Student / Parent Name" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Grade / Role *</label>
                    <input className="admin-form-input" required value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="e.g. Grade 10 Student" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Initials</label>
                    <input className="admin-form-input" value={form.initials} maxLength={2} onChange={e => setForm(f => ({ ...f, initials: e.target.value.toUpperCase() }))} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Stars (1-5)</label>
                    <select className="admin-form-input" value={form.stars} onChange={e => setForm(f => ({ ...f, stars: Number(e.target.value) }))}>
                      {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Star{s > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Avatar Color</label>
                  <div className="color-options">
                    {COLORS.map(c => (
                      <div key={c} className="color-swatch" style={{ background: c, outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }} onClick={() => setForm(f => ({ ...f, color: c }))} />
                    ))}
                  </div>
                </div>
                {editing && (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Visibility</label>
                    <select className="admin-form-input" value={form.active} onChange={e => setForm(f => ({ ...f, active: Number(e.target.value) }))}>
                      <option value={1}>Active (Shown on website)</option>
                      <option value={0}>Hidden</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="action-btn action-btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="action-btn action-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
