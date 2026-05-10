import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Layout.css';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getNavClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">EM</div>
            <div className="navbar-logo-text">
              <span className="navbar-logo-title">Educating Minds</span>
              <span className="navbar-logo-sub">Academic Hub</span>
            </div>
          </Link>

          <div className="navbar-links">
            <NavLink to="/" className={getNavClass} end>Home</NavLink>
            <div className="nav-dropdown">
              <NavLink to="/courses" className={getNavClass}>
                Courses ▾
              </NavLink>
              <div className="nav-dropdown-menu">
                <Link to="/courses/junior" className="nav-dropdown-item">📚 Grades 1–10 & English</Link>
                <Link to="/courses/senior" className="nav-dropdown-item">🎓 HSC 11–12th Sci & Commerce</Link>
              </div>
            </div>
            <NavLink to="/about" className={getNavClass}>About Us</NavLink>
            <NavLink to="/results" className={getNavClass}>Results</NavLink>
            <NavLink to="/contact" className={getNavClass}>Contact</NavLink>
          </div>

          <Link to="/enroll" className="btn btn-primary btn-sm navbar-cta">
            Enroll Now ✦
          </Link>

          <button
            className="navbar-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMobileOpen(false)}>✕</button>
        <NavLink to="/" className={getNavClass} end onClick={() => setMobileOpen(false)}>Home</NavLink>
        <NavLink to="/courses" className={getNavClass} onClick={() => setMobileOpen(false)}>Courses</NavLink>
        <NavLink to="/courses/junior" className={getNavClass} onClick={() => setMobileOpen(false)}>  ↳ Grades 1–10 & English</NavLink>
        <NavLink to="/courses/senior" className={getNavClass} onClick={() => setMobileOpen(false)}>  ↳ HSC 11–12th Science & Commerce</NavLink>
        <NavLink to="/about" className={getNavClass} onClick={() => setMobileOpen(false)}>About Us</NavLink>
        <NavLink to="/results" className={getNavClass} onClick={() => setMobileOpen(false)}>Results</NavLink>
        <NavLink to="/contact" className={getNavClass} onClick={() => setMobileOpen(false)}>Contact</NavLink>
        <Link to="/enroll" className="btn btn-primary" style={{ marginTop: 'auto', textAlign: 'center', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
          Enroll Now
        </Link>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className="navbar-logo-icon">EM</div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', fontSize: 16 }}>
                  Educating Minds
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--color-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Academic Hub
                </div>
              </div>
            </div>
            <p className="footer-brand-desc">
              Bridging traditional academic excellence with modern EdTech agility. Empowering students from Grade 1 to HSC with expert-led, personalised tuition.
            </p>
            <div className="footer-social">
              {['f', 'in', 'yt', 'tw'].map((s, i) => (
                <a key={i} href="#" className="footer-social-btn" aria-label={s}>
                  {s === 'f' && '🌐'}{s === 'in' && '💼'}{s === 'yt' && '▶'}{s === 'tw' && '✕'}
                </a>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <p className="footer-col-title">Courses</p>
            <div className="footer-links">
              <Link to="/courses/junior" className="footer-link">Grades 1–5</Link>
              <Link to="/courses/junior" className="footer-link">Grades 6–10</Link>
              <Link to="/courses/junior" className="footer-link">English Batches</Link>
              <Link to="/courses/senior" className="footer-link">HSC Science</Link>
              <Link to="/courses/senior" className="footer-link">HSC Commerce</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="footer-col-title">Quick Links</p>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/results" className="footer-link">Our Results</Link>
              <Link to="/enroll" className="footer-link">Enrollment</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="footer-col-title">Contact Us</p>
            <div className="footer-links" style={{ gap: 14 }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)', lineHeight: 1.6 }}>
                📍 123 Knowledge Park, Near City Center<br />Mumbai, Maharashtra 400001
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)' }}>📞 +91 98765 43210</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)' }}>✉️ info@educatingminds.in</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)' }}>⏰ Mon–Sat: 7AM – 9PM</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2024 Educating Minds Academic Hub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
