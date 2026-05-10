import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminStudents() {
  const { authFetch } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState('');

  const [feeForm, setFeeForm] = useState({ total_fees: 0, paid_fees: 0 });

  const load = () => {
    setLoading(true);
    authFetch(`/api/enrollments?status=enrolled&limit=1000`)
      .then(r => r.json())
      .then(data => setStudents(data.rows))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const handleUpdateFees = async (e) => {
    e.preventDefault();
    await authFetch(`/api/enrollments/${selected.id}/fees`, {
      method: 'PUT',
      body: JSON.stringify(feeForm),
    });
    load();
    showAlert('Fees updated successfully.');
    setSelected(null);
  };

  const openFeeModal = (student) => {
    setSelected(student);
    setFeeForm({
      total_fees: student.total_fees || 0,
      paid_fees: student.paid_fees || 0,
    });
  };

  const classes = [...new Set(students.map(s => s.grade))].sort();

  const filtered = classFilter ? students.filter(s => s.grade === classFilter) : students;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>🎓 Enrolled Students</h1>
        <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>Manage enrolled students class-wise and track fee payments.</p>
      </div>

      {alert && <div className="admin-alert admin-alert-success">✅ {alert}</div>}

      {/* Class Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setClassFilter('')}
          className={`action-btn ${classFilter === '' ? 'action-btn-primary' : 'action-btn-outline'}`}
        >
          All Classes
        </button>
        {classes.map(c => (
          <button
            key={c}
            onClick={() => setClassFilter(c)}
            className={`action-btn ${classFilter === c ? 'action-btn-primary' : 'action-btn-outline'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">{filtered.length} Students</span>
        </div>
        <div className="admin-card-body">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: 'var(--color-on-surface-var)' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🎓</div>
              <div className="admin-empty-title">No enrolled students</div>
            </div>
          ) : (
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Class / Grade</th>
                    <th>Course</th>
                    <th>Total Fees (₹)</th>
                    <th>Paid Fees (₹)</th>
                    <th>Balance (₹)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const total = s.total_fees || 0;
                    const paid = s.paid_fees || 0;
                    const balance = total - paid;
                    const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
                    const isFullyPaid = total > 0 && balance <= 0;

                    return (
                      <tr key={s.id}>
                        <td><div style={{ fontWeight: 600 }}>{s.student_name}</div></td>
                        <td>{s.grade}</td>
                        <td><span style={{ fontSize: 12 }}>{s.course}</span></td>
                        <td style={{ fontWeight: 600 }}>{total}</td>
                        <td style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{paid}</td>
                        <td style={{ fontWeight: 600, color: balance > 0 ? '#b91c1c' : '#047857' }}>{balance}</td>
                        <td style={{ minWidth: 120 }}>
                          {total > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                <span>{pct}% Paid</span>
                                {isFullyPaid && <span style={{ color: '#047857', fontWeight: 700 }}>Cleared</span>}
                              </div>
                              <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: pct + '%', background: isFullyPaid ? '#047857' : '#FF5E14', borderRadius: 3 }} />
                              </div>
                            </div>
                          ) : (
                            <span style={{ fontSize: 11, color: 'var(--color-on-surface-var)' }}>Fees not set</span>
                          )}
                        </td>
                        <td>
                          <button className="action-btn action-btn-outline" onClick={() => openFeeModal(s)}>
                            💳 Update Fees
                          </button>
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

      {selected && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="admin-modal">
            <h2 className="admin-modal-title">Update Fee Details</h2>
            <p className="admin-modal-sub">Update fees for <strong>{selected.student_name}</strong> ({selected.grade})</p>
            
            <form onSubmit={handleUpdateFees}>
              <div className="admin-form-group" style={{ marginBottom: 16 }}>
                <label className="admin-form-label">Total Fees (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="admin-form-input"
                  value={feeForm.total_fees}
                  onChange={e => setFeeForm(f => ({ ...f, total_fees: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 24 }}>
                <label className="admin-form-label">Fees Paid (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="admin-form-input"
                  value={feeForm.paid_fees}
                  onChange={e => setFeeForm(f => ({ ...f, paid_fees: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="action-btn action-btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                <button type="submit" className="action-btn action-btn-primary">Save Fees</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
