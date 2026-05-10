import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#00235A', '#FF5E14', '#03EC8D', '#1a4a8a', '#cc4a0f', '#00874f', '#7c3aed', '#db2777'];
const BLANK = { name: '', grade: '', percentage: '', year: new Date().getFullYear(), stream: 'General', initials: '', color: '#00235A', rank: 1 };

export default function AdminResults() {
  const { authFetch } = useAuth();
  const [results, setResults] = useState([]);
  const [years,   setYears]   = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);
  const [alert,   setAlert]   = useState('');
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    const qs = yearFilter ? `?year=${yearFilter}` : '';
    authFetch(`/api/results${qs}`).then(r => r.json()).then(setResults).finally(() => setLoading(false));
  };

  useEffect(() => {
    authFetch('/api/results/years').then(r => r.json()).then(setYears);
  }, []);

  useEffect(() => { setLoading(true); load(); }, [yearFilter]);

  const openAdd = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (r) => {
    setEditing(r.id);
    setForm({ name: r.name, grade: r.grade, percentage: r.percentage, year: r.year, stream: r.stream, initials: r.initials, color: r.color, rank: r.rank });
    setModal(true);
  };

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url    = editing ? `/api/results/${editing}` : '/api/results';
    const method = editing ? 'PUT' : 'POST';
    const res = await authFetch(url, { method, body: JSON.stringify(form) });
    if (res.ok) {
      setModal(false);
      load();
      showAlert(editing ? 'Result updated!' : 'Result added!');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this result?')) return;
    await authFetch(`/api/results/${id}`, { method: 'DELETE' });
    load();
    showAlert('Result deleted.');
  };

  const filtered = results.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.grade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>🏆 Results</h1>
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>Manage student results and toppers for each year.</p>
        </div>
        <button className="action-btn action-btn-primary" style={{ padding: '12px 20px', fontSize: 14 }} onClick={openAdd}>
          + Add New Result
        </button>
      </div>

      {alert && <div className="admin-alert admin-alert-success">✅ {alert}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">{filtered.length} Results</span>
          <div className="admin-filter-bar">
            <input
              className="admin-search-input"
              placeholder="Search by name or grade..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="admin-search-input"
              style={{ minWidth: 130 }}
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="admin-card-body">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-on-surface-var)', fontSize: 14 }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🏆</div>
              <div className="admin-empty-title">No results found</div>
              <div className="admin-empty-desc">Add your first result using the button above.</div>
            </div>
          ) : (
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Grade / Class</th>
                    <th>%</th>
                    <th>Year</th>
                    <th>Stream</th>
                    <th>Rank</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%', background: r.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                          }}>{r.initials || r.name.substring(0,2).toUpperCase()}</div>
                          <span style={{ fontWeight: 600 }}>{r.name}</span>
                        </div>
                      </td>
                      <td>{r.grade}</td>
                      <td><strong style={{ color: 'var(--color-secondary)' }}>{r.percentage}%</strong></td>
                      <td><span className="chip chip-navy">{r.year}</span></td>
                      <td>{r.stream}</td>
                      <td>#{r.rank}</td>
                      <td>
                        <div className="btn-actions">
                          <button className="action-btn action-btn-outline" onClick={() => openEdit(r)}>✏️ Edit</button>
                          <button className="action-btn action-btn-danger" onClick={() => handleDelete(r.id)}>🗑 Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <h2 className="admin-modal-title">{editing ? 'Edit Result' : 'Add New Result'}</h2>
            <p className="admin-modal-sub">Fill in the student's result details below.</p>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Student Name *</label>
                  <input className="admin-form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, initials: e.target.value.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase() }))} placeholder="e.g. Arjun Verma" />
                </div>
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Grade / Class *</label>
                  <input className="admin-form-input" required value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="e.g. HSC Science – Grade 12" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Percentage *</label>
                  <input className="admin-form-input" type="number" step="0.01" min="0" max="100" required value={form.percentage} onChange={e => setForm(f => ({ ...f, percentage: e.target.value }))} placeholder="97.8" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Year *</label>
                  <input className="admin-form-input" type="number" min="2010" max="2050" required value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Stream</label>
                  <select className="admin-form-input" value={form.stream} onChange={e => setForm(f => ({ ...f, stream: e.target.value }))}>
                    <option>General</option><option>Junior</option><option>Science</option><option>Commerce</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Rank</label>
                  <input className="admin-form-input" type="number" min="1" value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Initials</label>
                  <input className="admin-form-input" value={form.initials} onChange={e => setForm(f => ({ ...f, initials: e.target.value.toUpperCase().substring(0,2) }))} placeholder="AV" maxLength={2} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Avatar Color</label>
                  <div className="color-options">
                    {COLORS.map(c => (
                      <div
                        key={c}
                        className="color-swatch"
                        style={{ background: c, outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }}
                        onClick={() => setForm(f => ({ ...f, color: c }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="action-btn action-btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="action-btn action-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Result' : 'Add Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
