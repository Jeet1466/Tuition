import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const BLANK = { time: '', type: '', days: '', seats_total: 20, seats_taken: 0, grade: '', stream: 'Junior' };

export default function AdminBatches() {
  const { authFetch } = useAuth();
  const [batches,  setBatches]  = useState([]);
  const [streamFilter, setStreamFilter] = useState('');
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [alert,    setAlert]    = useState('');
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  const load = () => {
    const qs = streamFilter ? `?stream=${streamFilter}` : '';
    authFetch(`/api/batches${qs}`).then(r => r.json()).then(setBatches).finally(() => setLoading(false));
  };
  useEffect(() => { setLoading(true); load(); }, [streamFilter]);

  const openAdd  = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (b) => {
    setEditing(b.id);
    setForm({ time: b.time, type: b.type, days: b.days, seats_total: b.seats_total, seats_taken: b.seats_taken, grade: b.grade, stream: b.stream });
    setModal(true);
  };

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url    = editing ? `/api/batches/${editing}` : '/api/batches';
    const method = editing ? 'PUT' : 'POST';
    const res = await authFetch(url, { method, body: JSON.stringify({ ...form, active: 1 }) });
    if (res.ok) { setModal(false); load(); showAlert(editing ? 'Batch updated!' : 'Batch added!'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this batch?')) return;
    await authFetch(`/api/batches/${id}`, { method: 'DELETE' });
    load();
    showAlert('Batch deleted.');
  };

  const fillPct = (b) => Math.round((b.seats_taken / b.seats_total) * 100);
  const fillColor = (pct) => pct >= 80 ? '#b91c1c' : pct >= 60 ? '#b45309' : '#047857';

  return (
    <>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>📅 Batches</h1>
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>Manage class schedules and seat availability.</p>
        </div>
        <button className="action-btn action-btn-primary" style={{ padding: '12px 20px', fontSize: 14 }} onClick={openAdd}>
          + Add Batch
        </button>
      </div>

      {alert && <div className="admin-alert admin-alert-success">✅ {alert}</div>}

      {/* Stream Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['', 'Junior', 'Senior'].map(s => (
          <button key={s} onClick={() => setStreamFilter(s)} className={`action-btn ${streamFilter === s ? 'action-btn-primary' : 'action-btn-outline'}`}>
            {s || 'All Streams'}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">{batches.length} Batches</span>
        </div>
        <div className="admin-card-body">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: 'var(--color-on-surface-var)' }}>Loading...</div>
          ) : batches.length === 0 ? (
            <div className="admin-empty"><div className="admin-empty-icon">📅</div><div className="admin-empty-title">No batches found</div></div>
          ) : (
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Batch Type</th>
                    <th>Time</th>
                    <th>Days</th>
                    <th>Grade</th>
                    <th>Stream</th>
                    <th>Seats</th>
                    <th>Fill</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map(b => {
                    const pct = fillPct(b);
                    return (
                      <tr key={b.id}>
                        <td><strong>{b.type}</strong></td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{b.time}</td>
                        <td><span style={{ fontSize: 12 }}>{b.days}</span></td>
                        <td>{b.grade}</td>
                        <td>
                          <span className="chip chip-navy" style={{ fontSize: 11 }}>{b.stream}</span>
                        </td>
                        <td style={{ fontSize: 13 }}>
                          <strong>{b.seats_taken}</strong> / {b.seats_total}
                          <div style={{ fontSize: 11, color: 'var(--color-on-surface-var)' }}>{b.seats_total - b.seats_taken} left</div>
                        </td>
                        <td style={{ minWidth: 100 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: pct + '%', background: fillColor(pct), borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: fillColor(pct), width: 30 }}>{pct}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="btn-actions">
                            <button className="action-btn action-btn-outline" onClick={() => openEdit(b)}>✏️ Edit</button>
                            <button className="action-btn action-btn-danger" onClick={() => handleDelete(b.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <h2 className="admin-modal-title">{editing ? 'Edit Batch' : 'Add New Batch'}</h2>
            <p className="admin-modal-sub">Configure batch timing and capacity.</p>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Batch Type / Name *</label>
                  <input className="admin-form-input" required value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="e.g. Morning Batch" />
                </div>
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Time *</label>
                  <input className="admin-form-input" required value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 7:00 AM – 9:00 AM" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Days *</label>
                  <input className="admin-form-input" required value={form.days} onChange={e => setForm(f => ({ ...f, days: e.target.value }))} placeholder="e.g. Mon – Sat" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Grade / Level</label>
                  <input className="admin-form-input" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="e.g. Gr. 9–10" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Stream</label>
                  <select className="admin-form-input" value={form.stream} onChange={e => setForm(f => ({ ...f, stream: e.target.value }))}>
                    <option>Junior</option><option>Senior</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Total Seats</label>
                  <input className="admin-form-input" type="number" min="1" value={form.seats_total} onChange={e => setForm(f => ({ ...f, seats_total: Number(e.target.value) }))} />
                </div>
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Seats Taken</label>
                  <input className="admin-form-input" type="number" min="0" max={form.seats_total} value={form.seats_taken} onChange={e => setForm(f => ({ ...f, seats_taken: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="action-btn action-btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="action-btn action-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Batch' : 'Add Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
