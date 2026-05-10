import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const navItems = [
  { to: '/admin',              icon: '📊', label: 'Dashboard',    exact: true },
  { to: '/admin/students',     icon: '🎓', label: 'Students' },
  { to: '/admin/results',      icon: '🏆', label: 'Results' },
  { to: '/admin/enrollments',  icon: '📋', label: 'Enrollments' },
  { to: '/admin/testimonials', icon: '💬', label: 'Testimonials' },
  { to: '/admin/batches',      icon: '📅', label: 'Batches' },
  { to: '/admin/contacts',     icon: '✉️',  label: 'Messages' },
];

export default function AdminLayout({ pendingCount = 0, unreadCount = 0 }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-root">
      {/* Overlay for mobile */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <a href="/" className="admin-sidebar-logo" target="_blank" rel="noreferrer">
          <div className="admin-sidebar-logo-icon">EM</div>
          <div>
            <div className="admin-sidebar-logo-text">Educating Minds</div>
            <div className="admin-sidebar-logo-sub">Admin Panel</div>
          </div>
        </a>

        <nav className="admin-nav">
          <div className="admin-nav-section">Main Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Enrollments' && pendingCount > 0 && (
                <span className="admin-nav-badge">{pendingCount}</span>
              )}
              {item.label === 'Messages' && unreadCount > 0 && (
                <span className="admin-nav-badge">{unreadCount}</span>
              )}
            </NavLink>
          ))}

          <div className="admin-nav-section">Quick Links</div>
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link" onClick={closeSidebar}>
            <span className="admin-nav-icon">🌐</span>
            <span>View Website</span>
          </a>
          <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`} onClick={closeSidebar}>
            <span className="admin-nav-icon">⚙️</span>
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              {admin?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div className="admin-user-name">{admin?.username || 'Admin'}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <div className="admin-topbar-title">Admin Panel</div>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-topbar-time">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <div className="admin-user-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
              {admin?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
