import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminContacts() {
  const { authFetch } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [filter,   setFilter]   = useState('');
  const [selected, setSelected] = useState(null);
  const [alert,    setAlert]    = useState('');
  const [loading,  setLoading]  = useState(true);

  const load = () => {
    const qs = filter ? `?status=${filter}` : '';
    authFetch(`/api/contacts${qs}`).then(r => r.json()).then(setContacts).finally(() => setLoading(false));
  };
  useEffect(() => { setLoading(true); load(); }, [filter]);

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const changeStatus = async (id, status) => {
    await authFetch(`/api/contacts/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    load();
    showAlert(`Marked as "${status}"`);
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await authFetch(`/api/contacts/${id}`, { method: 'DELETE' });
    load();
    showAlert('Message deleted.');
    setSelected(null);
  };

  const unread = contacts.filter(c => c.status === 'unread').length;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>
          ✉️ Messages {unread > 0 && <span style={{ fontSize: 16, background: 'var(--color-secondary)', color: '#fff', padding: '3px 10px', borderRadius: 999, marginLeft: 8 }}>{unread} unread</span>}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>Contact form submissions from the website.</p>
      </div>

      {alert && <div className="admin-alert admin-alert-success">✅ {alert}</div>}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['', 'unread', 'read'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`action-btn ${filter === s ? 'action-btn-primary' : 'action-btn-outline'}`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className={`admin-split-layout ${selected ? 'with-panel' : ''}`}>
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">{contacts.length} Messages</span>
          </div>
          <div className="admin-card-body">
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: 'var(--color-on-surface-var)' }}>Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="admin-empty"><div className="admin-empty-icon">📭</div><div className="admin-empty-title">No messages</div></div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email / Phone</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(c => (
                      <tr key={c.id} style={{ cursor: 'pointer', fontWeight: c.status === 'unread' ? 600 : 400 }}>
                        <td onClick={() => { setSelected(s => s?.id === c.id ? null : c); if (c.status === 'unread') changeStatus(c.id, 'read'); }}>
                          {c.name}
                        </td>
                        <td>
                          <div style={{ fontSize: 13 }}>{c.email}</div>
                          {c.phone && <div style={{ fontSize: 11, color: 'var(--color-on-surface-var)' }}>{c.phone}</div>}
                        </td>
                        <td style={{ fontSize: 13 }}>{c.subject || 'General'}</td>
                        <td>
                          <span className={`status-badge status-${c.status}`}>{c.status}</span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--color-on-surface-var)', whiteSpace: 'nowrap' }}>
                          {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td>
                          <div className="btn-actions">
                            <button className="action-btn action-btn-outline" style={{ fontSize: 11 }} onClick={() => { setSelected(s => s?.id === c.id ? null : c); if (c.status === 'unread') changeStatus(c.id, 'read'); }}>
                              👁 View
                            </button>
                            <button className="action-btn action-btn-danger" style={{ fontSize: 11 }} onClick={() => handleDelete(c.id)}>🗑</button>
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

        {selected && (
          <div className="admin-card" style={{ position: 'sticky', top: 80 }}>
            <div className="admin-card-header">
              <span className="admin-card-title">Message Details</span>
              <button className="action-btn action-btn-outline" style={{ fontSize: 12 }} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {[
                { label: 'From', value: selected.name },
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone || 'Not provided' },
                { label: 'Subject', value: selected.subject || 'General Inquiry' },
                { label: 'Received', value: new Date(selected.created_at).toLocaleString('en-IN') },
              ].map((f, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-on-surface-var)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{f.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--color-on-surface)' }}>{f.value}</div>
                </div>
              ))}
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16, marginTop: 8, marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-on-surface-var)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Message</div>
                <p style={{ fontSize: 14, color: 'var(--color-on-surface)', lineHeight: 1.7 }}>{selected.message}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="action-btn action-btn-outline" onClick={() => changeStatus(selected.id, selected.status === 'unread' ? 'read' : 'unread')} style={{ flex: 1, justifyContent: 'center' }}>
                  {selected.status === 'unread' ? '✅ Mark Read' : '📩 Mark Unread'}
                </button>
                <button className="action-btn action-btn-danger" onClick={() => handleDelete(selected.id)} style={{ flex: 1, justifyContent: 'center' }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
