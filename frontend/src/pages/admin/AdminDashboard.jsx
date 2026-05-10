import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80, fontSize: 14, color: 'var(--color-on-surface-var)' }}>
      Loading dashboard...
    </div>
  );

  const statCards = [
    { icon: '📋', label: 'Total Enrollments', value: stats.totalEnrollments, color: 'rgba(0,35,90,0.08)', sub: `${stats.pendingEnrollments} pending` },
    { icon: '🏆', label: 'Results Added', value: stats.totalResults, color: 'rgba(255,94,20,0.10)', sub: 'All years' },
    { icon: '💬', label: 'Testimonials', value: stats.totalTestimonials, color: 'rgba(3,236,141,0.10)', sub: 'Published' },
    { icon: '✉️', label: 'Messages', value: stats.totalContacts, color: 'rgba(0,35,90,0.06)', sub: `${stats.unreadContacts} unread` },
  ];

  const statusColor = (s) => {
    const map = { pending: '#b45309', contacted: '#1d4ed8', enrolled: '#047857', rejected: '#b91c1c', unread: '#b91c1c', read: '#374151' };
    return map[s] || '#374151';
  };
  const statusBg = (s) => {
    const map = { pending: 'rgba(245,158,11,0.12)', contacted: 'rgba(59,130,246,0.12)', enrolled: 'rgba(16,185,129,0.12)', rejected: 'rgba(239,68,68,0.12)', unread: 'rgba(239,68,68,0.12)', read: 'rgba(107,114,128,0.12)' };
    return map[s] || 'rgba(107,114,128,0.12)';
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>
          Welcome back! Here's what's happening with Educating Minds.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--color-secondary)', fontWeight: 600, marginTop: 4 }}>{s.sub}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: s.color }}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        {/* Recent Enrollments */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">📋 Recent Enrollments</span>
            <Link to="/admin/enrollments" className="action-btn action-btn-outline">View All</Link>
          </div>
          {stats.recentEnrollments.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📭</div>
              <div className="admin-empty-title">No enrollments yet</div>
            </div>
          ) : (
            stats.recentEnrollments.map((e, i) => (
              <div key={i} className="recent-item">
                <div className="recent-item-icon" style={{ background: 'rgba(0,35,90,0.08)' }}>👤</div>
                <div style={{ flex: 1 }}>
                  <div className="recent-item-name">{e.student_name}</div>
                  <div className="recent-item-meta">{e.grade} · {e.course} · {e.phone}</div>
                </div>
                <span
                  className="status-badge"
                  style={{ background: statusBg(e.status), color: statusColor(e.status) }}
                >
                  {e.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent Messages */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">✉️ Recent Messages</span>
            <Link to="/admin/contacts" className="action-btn action-btn-outline">View All</Link>
          </div>
          {stats.recentContacts.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📭</div>
              <div className="admin-empty-title">No messages yet</div>
            </div>
          ) : (
            stats.recentContacts.map((c, i) => (
              <div key={i} className="recent-item">
                <div className="recent-item-icon" style={{ background: c.status === 'unread' ? 'rgba(239,68,68,0.10)' : 'rgba(107,114,128,0.10)' }}>✉️</div>
                <div style={{ flex: 1 }}>
                  <div className="recent-item-name">{c.name}</div>
                  <div className="recent-item-meta">{c.subject || 'General Inquiry'} · {c.email}</div>
                </div>
                <span
                  className="status-badge"
                  style={{ background: statusBg(c.status), color: statusColor(c.status) }}
                >
                  {c.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <div className="admin-card-header">
          <span className="admin-card-title">⚡ Quick Actions</span>
        </div>
        <div style={{ display: 'flex', gap: 12, padding: 20, flexWrap: 'wrap' }}>
          {[
            { to: '/admin/results', icon: '🏆', label: 'Add Result' },
            { to: '/admin/testimonials', icon: '💬', label: 'Add Testimonial' },
            { to: '/admin/batches', icon: '📅', label: 'Manage Batches' },
            { to: '/admin/enrollments', icon: '📋', label: 'Review Enrollments' },
          ].map((q, i) => (
            <Link key={i} to={q.to} className="action-btn action-btn-outline" style={{ padding: '12px 20px', gap: 8, fontSize: 14, fontWeight: 600 }}>
              <span>{q.icon}</span> {q.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
