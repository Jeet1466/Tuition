import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar, Footer } from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home          from './pages/Home';
import About         from './pages/About';
import JuniorCourses from './pages/JuniorCourses';
import SeniorCourses from './pages/SeniorCourses';
import Enroll        from './pages/Enroll';
import Results       from './pages/Results';
import Contact       from './pages/Contact';
import Payment       from './pages/Payment';

// Admin pages
import AdminLogin        from './pages/admin/AdminLogin';
import AdminLayout       from './pages/admin/AdminLayout';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminStudents     from './pages/admin/AdminStudents';
import AdminResults      from './pages/admin/AdminResults';
import AdminEnrollments  from './pages/admin/AdminEnrollments';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminBatches      from './pages/admin/AdminBatches';
import AdminContacts     from './pages/admin/AdminContacts';
import AdminSettings     from './pages/admin/AdminSettings';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Courses index page
function CoursesIndex() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #000f30 0%, #00235a 100%)', padding: '140px 0 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Our <span style={{ color: '#FF5E14' }}>Courses</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.70)', lineHeight: 1.7, marginBottom: 48 }}>
            Choose your program. Comprehensive curriculum for every grade.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 520, margin: '0 auto' }}>
            {[
              { to: '/courses/junior', emoji: '📚', title: 'Grades 1–10 & English', desc: 'Primary & Secondary classes' },
              { to: '/courses/senior', emoji: '🎓', title: 'HSC 11–12th', desc: 'Science & Commerce Streams' },
            ].map((c, i) => (
              <a key={i} href={c.to} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '28px 24px', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{c.emoji}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.60)' }}>{c.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Public layout wrapper
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/courses" element={<PublicLayout><CoursesIndex /></PublicLayout>} />
          <Route path="/courses/junior" element={<PublicLayout><JuniorCourses /></PublicLayout>} />
          <Route path="/courses/senior" element={<PublicLayout><SeniorCourses /></PublicLayout>} />
          <Route path="/results" element={<PublicLayout><Results /></PublicLayout>} />
          <Route path="/enroll" element={<PublicLayout><Enroll /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/payment" element={<PublicLayout><Payment /></PublicLayout>} />

          {/* ── Admin Routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students"     element={<AdminStudents />} />
            <Route path="results"      element={<AdminResults />} />
            <Route path="enrollments"  element={<AdminEnrollments />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="batches"      element={<AdminBatches />} />
            <Route path="contacts"     element={<AdminContacts />} />
            <Route path="settings"     element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
