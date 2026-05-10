import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const STATUS_OPTIONS = ['pending', 'contacted', 'enrolled', 'rejected'];

export default function AdminEnrollments() {
  const { authFetch } = useAuth();
  const [data,     setData]     = useState({ rows: [], total: 0 });
  const [filter,   setFilter]   = useState('');
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [alert,    setAlert]    = useState('');
  const LIMIT = 15;

  const load = () => {
    setLoading(true);
    const qs = new URLSearchParams({ page, limit: LIMIT });
    if (filter) qs.set('status', filter);
    authFetch(`/api/enrollments?${qs}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, filter]);

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const changeStatus = async (id, status) => {
    await authFetch(`/api/enrollments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    load();
    showAlert(`Status updated to "${status}"`);
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this enrollment?')) return;
    await authFetch(`/api/enrollments/${id}`, { method: 'DELETE' });
    load();
    showAlert('Enrollment deleted.');
    setSelected(null);
  };

  const statusColor = (s) => ({ pending: '#b45309', contacted: '#1d4ed8', enrolled: '#047857', rejected: '#b91c1c' })[s] || '#374151';
  const statusBg    = (s) => ({ pending: 'rgba(245,158,11,0.12)', contacted: 'rgba(59,130,246,0.12)', enrolled: 'rgba(16,185,129,0.12)', rejected: 'rgba(239,68,68,0.12)' })[s] || 'rgba(107,114,128,0.12)';

  const filtered = data.rows.filter(e =>
    e.student_name.toLowerCase().includes(search.toLowerCase()) ||
    e.parent_name.toLowerCase().includes(search.toLowerCase()) ||
    e.phone.includes(search) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(data.total / LIMIT);

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>📋 Enrollments</h1>
        <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>Manage student enrollment inquiries and their status.</p>
      </div>

      {alert && <div className="admin-alert admin-alert-success">✅ {alert}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['', ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`action-btn ${filter === s ? 'action-btn-primary' : 'action-btn-outline'}`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className={`admin-split-layout ${selected ? 'with-panel' : ''}`}>
        {/* Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">{data.total} Enrollments</span>
            <input className="admin-search-input" placeholder="Search name, phone, email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="admin-card-body">
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: 'var(--color-on-surface-var)' }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty"><div className="admin-empty-icon">📭</div><div className="admin-empty-title">No enrollments found</div></div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Parent / Phone</th>
                      <th>Grade</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(e => (
                      <tr key={e.id} style={{ cursor: 'pointer' }}>
                        <td onClick={() => setSelected(selected?.id === e.id ? null : e)}>
                          <div style={{ fontWeight: 600 }}>{e.student_name}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{e.parent_name}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-on-surface-var)' }}>{e.phone}</div>
                        </td>
                        <td>{e.grade}</td>
                        <td><span style={{ fontSize: 12 }}>{e.course}</span></td>
                        <td>
                          <span className="status-badge" style={{ background: statusBg(e.status), color: statusColor(e.status) }}>
                            {e.status}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--color-on-surface-var)', whiteSpace: 'nowrap' }}>
                          {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td>
                          <div className="btn-actions">
                            <button className="action-btn action-btn-outline" style={{ fontSize: 11 }} onClick={() => setSelected(selected?.id === e.id ? null : e)}>
                              👁 View
                            </button>
                            <button className="action-btn action-btn-danger" style={{ fontSize: 11 }} onClick={() => handleDelete(e.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="admin-pagination">
              <span className="admin-pagination-info">Page {page} of {totalPages} ({data.total} total)</span>
              <div className="admin-pagination-btns">
                <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <button key={i} className={`admin-page-btn ${page === i+1 ? 'active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
                ))}
                <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="admin-card" style={{ position: 'sticky', top: 80 }}>
            <div className="admin-card-header">
              <span className="admin-card-title">Enrollment Details</span>
              <button className="action-btn action-btn-outline" style={{ fontSize: 12 }} onClick={() => setSelected(null)}>✕ Close</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                  {selected.student_name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 16 }}>{selected.student_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-on-surface-var)' }}>{selected.grade}</div>
                </div>
              </div>

              {[
                { label: 'Parent Name', value: selected.parent_name },
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'Course', value: selected.course },
                { label: 'Batch Preference', value: selected.batch || 'Not specified' },
                { label: 'Message', value: selected.message || 'None' },
                { label: 'Applied On', value: new Date(selected.created_at).toLocaleString('en-IN') },
              ].map((f, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-on-surface-var)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{f.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--color-on-surface)' }}>{f.value}</div>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-on-surface-var)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Update Status</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      className={`action-btn ${selected.status === s ? 'action-btn-primary' : 'action-btn-outline'}`}
                      style={{ fontSize: 12 }}
                      onClick={() => changeStatus(selected.id, s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button className="action-btn action-btn-danger" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} onClick={() => handleDelete(selected.id)}>
                🗑 Delete Enrollment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
