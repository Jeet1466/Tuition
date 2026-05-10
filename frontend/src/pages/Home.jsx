import { Link } from 'react-router-dom';
import './Home.css';

const subjects = [
  { icon: '🔢', name: 'Mathematics', pct: '98%', color: 'rgba(255,94,20,0.15)' },
  { icon: '🔬', name: 'Science', pct: '96%', color: 'rgba(3,236,141,0.15)' },
  { icon: '📖', name: 'English', pct: '94%', color: 'rgba(0,35,90,0.10)' },
  { icon: '🏛️', name: 'Social Studies', pct: '92%', color: 'rgba(255,94,20,0.10)' },
];

const features = [
  { icon: '👨‍🏫', title: 'Expert Faculty', desc: 'Highly qualified teachers with 10+ years of experience, dedicated to personalised mentoring and academic excellence.' },
  { icon: '📊', title: 'Track Progress', desc: 'Regular assessments, monthly report cards and parent-teacher meetings to ensure continuous improvement.' },
  { icon: '🏆', title: 'Proven Results', desc: 'Consistent 95%+ pass rate with top rankers in board exams. Our students achieve their full potential.' },
  { icon: '📅', title: 'Flexible Batches', desc: 'Morning, afternoon and evening batches to fit every student\'s schedule. Weekend batches available too.' },
  { icon: '💡', title: 'Smart Learning', desc: 'Blending traditional teaching with modern tools — concept videos, practice tests and doubt-solving sessions.' },
  { icon: '🤝', title: 'Parent Connect', desc: 'Transparent communication with parents through regular updates, meetings, and an easy inquiry system.' },
];

const courses = [
  {
    emoji: '📚',
    grade: 'Grades 1–10',
    sub: 'Primary & Secondary Education',
    subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    batches: '6 Batches',
    duration: '2 hrs/day',
    link: '/courses/junior',
    color: '#03ec8d',
  },
  {
    emoji: '🎓',
    grade: 'HSC 11–12th',
    sub: 'Science & Commerce Streams',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Maths', 'Accounts', 'Economics'],
    batches: '4 Batches',
    duration: '3 hrs/day',
    link: '/courses/senior',
    color: '#FF5E14',
  },
];

const testimonials = [
  {
    stars: 5,
    quote: 'My daughter went from 65% to 92% in just one academic year. The teachers here are exceptional and truly care about each student.',
    name: 'Priya Sharma',
    grade: 'Parent of Grade 9 Student',
    initials: 'PS',
    color: '#FF5E14',
  },
  {
    stars: 5,
    quote: 'I cleared HSC Science with distinction and got into my dream engineering college. Educating Minds played a huge role in that success.',
    name: 'Rahul Mehta',
    grade: 'HSC Science – 94%',
    initials: 'RM',
    color: '#00235A',
  },
  {
    stars: 5,
    quote: 'The personalised attention and regular mock tests gave my son the confidence he needed. Best tuition centre in the city!',
    name: 'Anjali Patel',
    grade: 'Parent of Grade 12 Student',
    initials: 'AP',
    color: '#03EC8D',
  },
];

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            {/* Left */}
            <div className="animate-fadeInUp">
              <div className="hero-badge">
                <span>✦</span> Trusted by 2000+ Families Since 2010
              </div>
              <h1 className="hero-title">
                Where Every Mind<br />
                <span>Learns, Grows &</span><br />
                Achieves More
              </h1>
              <p className="hero-desc">
                Expert-led tuition for Grades 1–12. Personalised learning, proven results,
                and a nurturing environment that transforms academic potential into excellence.
              </p>
              <div className="hero-actions">
                <Link to="/enroll" className="btn btn-primary btn-lg">
                  Start Enrollment →
                </Link>
                <Link to="/courses" className="btn btn-white btn-lg">
                  Explore Courses
                </Link>
              </div>
              <div className="hero-stats">
                {[
                  { value: '2000', unit: '+', label: 'Students Enrolled' },
                  { value: '95', unit: '%', label: 'Pass Rate' },
                  { value: '14', unit: 'yrs', label: 'Of Excellence' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="hero-stat-value">
                      {s.value}<span>{s.unit}</span>
                    </div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – Visual Card */}
            <div className="hero-visual">
              <div className="hero-card-main">
                <div className="hero-card-header">
                  <span className="hero-card-title">Student Performance</span>
                  <span className="hero-card-badge">LIVE</span>
                </div>
                <div className="hero-subject-list">
                  {subjects.map((s, i) => (
                    <div key={i} className="hero-subject-item">
                      <div className="hero-subject-icon" style={{ background: s.color }}>
                        {s.icon}
                      </div>
                      <span className="hero-subject-name">{s.name}</span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.10)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: s.pct, background: 'var(--color-tertiary)', borderRadius: 4 }} />
                      </div>
                      <span className="hero-subject-pct">{s.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating badges */}
              <div className="hero-floating-badge hero-floating-badge-1">
                <div className="badge-icon" style={{ background: 'rgba(3,236,141,0.12)', fontSize: 22 }}>🏆</div>
                <div>
                  <div className="badge-text-val">Top Rankers</div>
                  <div className="badge-text-label">Board 2024</div>
                </div>
              </div>
              <div className="hero-floating-badge hero-floating-badge-2">
                <div className="badge-icon" style={{ background: 'rgba(255,94,20,0.12)', fontSize: 22 }}>📈</div>
                <div>
                  <div className="badge-text-val">+27%</div>
                  <div className="badge-text-label">Avg Score Improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-dot" />
          <span>Scroll Down</span>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-label">Why Choose Us</span>
            <h2 className="headline-lg section-title" style={{ margin: '8px auto 16px' }}>
              Everything Your Child Needs to Excel
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              From expert instruction to flexible schedules, we've built the perfect environment for academic growth.
            </p>
          </div>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className={`feature-card animate-fadeInUp delay-${i + 1}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESULTS BANNER ===== */}
      <section className="results-banner">
        <div className="container">
          <div className="results-stats">
            {[
              { value: '2000', unit: '+', label: 'Students Enrolled' },
              { value: '95', unit: '%', label: 'Board Pass Rate' },
              { value: '150', unit: '+', label: 'Top 10 Rankers' },
              { value: '14', unit: '+', label: 'Years of Excellence' },
            ].map((s, i) => (
              <div key={i} className="result-stat">
                <div className="result-stat-value">{s.value}<span>{s.unit}</span></div>
                <div className="result-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COURSES PREVIEW ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Programs</span>
            <h2 className="headline-lg section-title">Courses Designed to Succeed</h2>
            <p className="section-desc">
              Comprehensive curriculum aligned with CBSE and State Boards, taught by subject experts.
            </p>
          </div>
          <div className="grid-2" style={{ maxWidth: 900 }}>
            {courses.map((c, i) => (
              <div key={i} className="course-card">
                <div className="course-card-header">
                  <span className="course-card-emoji">{c.emoji}</span>
                  <div className="course-card-grade">{c.grade}</div>
                  <div className="course-card-sub">{c.sub}</div>
                </div>
                <div className="course-card-body">
                  <div className="course-subjects">
                    {c.subjects.map((s, j) => (
                      <span key={j} className="chip chip-navy">{s}</span>
                    ))}
                  </div>
                  <div className="course-card-meta">
                    <div className="course-meta-item">
                      <span className="course-meta-label">Batches</span>
                      <span className="course-meta-value">{c.batches}</span>
                    </div>
                    <div className="course-meta-item">
                      <span className="course-meta-label">Duration</span>
                      <span className="course-meta-value">{c.duration}</span>
                    </div>
                  </div>
                  <Link to={c.link} className="btn btn-secondary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-label">Success Stories</span>
            <h2 className="headline-lg section-title" style={{ margin: '8px auto 16px' }}>
              What Our Students & Parents Say
            </h2>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-grade">{t.grade}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-title">Ready to Unlock Your Child's Full Potential?</h2>
          <p className="cta-desc">
            Join 2000+ families who trust Educating Minds. Admissions are open — limited seats available per batch.
          </p>
          <div className="cta-actions">
            <Link to="/enroll" className="btn btn-white btn-lg">
              Enroll Now — It's Free to Inquire
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.60)', color: '#fff' }}>
              Call Us Today
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
