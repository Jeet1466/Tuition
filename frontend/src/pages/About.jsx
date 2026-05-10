import { Link } from 'react-router-dom';
import './About.css';
import './Courses.css';

const team = [
  { name: 'Rajesh Sharma', role: 'Founder & Director', exp: '20 years experience', subjects: ['Mathematics', 'Physics'], initials: 'RS', color: '#00235A' },
  { name: 'Sunita Patel', role: 'Head of Science Dept.', exp: '15 years experience', subjects: ['Chemistry', 'Biology'], initials: 'SP', color: '#FF5E14' },
  { name: 'Anil Mehta', role: 'Senior Math Faculty', exp: '12 years experience', subjects: ['Mathematics', 'Statistics'], initials: 'AM', color: '#03EC8D' },
  { name: 'Priya Desai', role: 'English Language Expert', exp: '10 years experience', subjects: ['English', 'Literature'], initials: 'PD', color: '#1a4a8a' },
  { name: 'Deepak Joshi', role: 'Commerce Faculty', exp: '14 years experience', subjects: ['Accountancy', 'Economics'], initials: 'DJ', color: '#cc4a0f' },
  { name: 'Meera Nair', role: 'Junior Grade Specialist', exp: '8 years experience', subjects: ['Science', 'Social Studies'], initials: 'MN', color: '#00874f' },
];

const timeline = [
  { year: '2010', event: 'Educating Minds Founded', desc: 'Started with a single batch of 20 students in a humble 2-room setup by Mr. Rajesh Sharma.' },
  { year: '2013', event: 'Expanded to HSC', desc: 'Launched Science and Commerce streams for Grades 11–12, with 3 dedicated faculty members.' },
  { year: '2016', event: 'New Campus Opened', desc: 'Moved to a larger, fully-equipped facility with 8 classrooms, a library, and a digital lab.' },
  { year: '2019', event: '1000th Student Enrolled', desc: 'Crossed the milestone of 1000 active students and achieved the highest board results in the district.' },
  { year: '2022', event: 'Digital Learning Integration', desc: 'Introduced digital tools, recorded lectures, and an online doubt-solving system for students.' },
  { year: '2024', event: '2000+ Students Strong', desc: 'Today, we serve over 2000 families with 25+ faculty and a 95%+ board pass rate every year.' },
];

const values = [
  { icon: '🎯', title: 'Academic Excellence', desc: 'We set high standards and guide every student to meet and surpass them through structured teaching.', color: 'rgba(0,35,90,0.08)' },
  { icon: '❤️', title: 'Nurturing Environment', desc: 'Every child is different. We celebrate individual growth and ensure no student feels left behind.', color: 'rgba(255,94,20,0.10)' },
  { icon: '🤝', title: 'Parent Partnership', desc: 'Regular meetings, transparent communication, and detailed progress reports keep parents involved.', color: 'rgba(3,236,141,0.12)' },
  { icon: '🔬', title: 'Innovative Teaching', desc: 'Combining traditional chalk-and-board with modern EdTech tools for the best learning outcomes.', color: 'rgba(0,35,90,0.06)' },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="about-hero-grid">
            <div>
              <div className="page-hero-breadcrumb">
                <Link to="/">Home</Link>
                <span>›</span>
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>About Us</span>
              </div>
              <h1 className="page-hero-title">
                14 Years of Shaping <span>Bright Futures</span>
              </h1>
              <p className="page-hero-desc">
                Founded in 2010, Educating Minds Academic Hub has grown from a single classroom to
                a full-scale learning institution trusted by over 2000 families across Mumbai.
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
                <Link to="/enroll" className="btn btn-primary">Start Enrollment →</Link>
                <Link to="/contact" className="btn btn-white">Contact Us</Link>
              </div>
            </div>
            <div className="about-mission-card">
              {[
                { icon: '🏆', color: 'rgba(255,94,20,0.20)', title: 'Our Mission', desc: 'To bridge the gap between traditional excellence and modern learning for every student.' },
                { icon: '👁️', color: 'rgba(3,236,141,0.20)', title: 'Our Vision', desc: 'To be the most trusted and impactful tuition centre in Maharashtra.' },
                { icon: '💎', color: 'rgba(255,255,255,0.15)', title: 'Our Promise', desc: 'Every student who joins us gets personalised attention, expert guidance, and measurable results.' },
              ].map((m, i) => (
                <div key={i} className="about-mission-item">
                  <div className="about-mission-icon" style={{ background: m.color }}>{m.icon}</div>
                  <div>
                    <div className="about-mission-title">{m.title}</div>
                    <div className="about-mission-desc">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-label">Our Core Principles</span>
            <h2 className="headline-lg section-title" style={{ margin: '8px auto 16px' }}>
              What We Stand For
            </h2>
          </div>
          <div className="grid-4">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon" style={{ background: v.color }}>{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Banner */}
      <section className="results-banner" style={{ background: 'linear-gradient(135deg, #000f30 0%, #00235a 100%)' }}>
        <div className="container">
          <div className="grid-4">
            {[
              { val: '2000+', label: 'Students Enrolled' },
              { val: '25+', label: 'Expert Faculty' },
              { val: '95%', label: 'Board Pass Rate' },
              { val: '14 yrs', label: 'Of Excellence' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                  {s.val.replace(/(\d+)/, (m) => `${m}<span style="color:var(--color-secondary)">`)}
                  {s.val}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)', marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-label">Our Faculty</span>
            <h2 className="headline-lg section-title" style={{ margin: '8px auto 16px' }}>
              Meet Our Expert Teachers
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Our faculty are not just teachers — they are mentors, guides, and champions of every student's success.
            </p>
          </div>
          <div className="grid-3">
            {team.map((t, i) => (
              <div key={i} className="team-card">
                <div className="team-card-body">
                  <div className="team-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div className="team-name">{t.name}</div>
                  <div className="team-role">{t.role}</div>
                  <div className="team-exp">📅 {t.exp}</div>
                  <div className="team-subjects">
                    {t.subjects.map((s, j) => <span key={j} className="chip chip-navy">{s}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section-bg">
        <div className="container">
          <div className="grid-2" style={{ gap: 80, alignItems: 'start' }}>
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="headline-lg section-title">A Journey of Growth</h2>
              <p className="section-desc">
                From a small startup classroom to Mumbai's most trusted tuition hub — every year has been a step forward.
              </p>
              <div style={{ marginTop: 40 }}>
                <Link to="/enroll" className="btn btn-primary">Join Our Journey →</Link>
              </div>
            </div>
            <div className="timeline">
              {timeline.map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-year">{t.year}</div>
                  <div className="timeline-event">{t.event}</div>
                  <div className="timeline-desc">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-title">Become Part of the Educating Minds Family</h2>
          <p className="cta-desc">
            Join 2000+ students and families who have chosen excellence. Seats are limited — enroll today.
          </p>
          <div className="cta-actions">
            <Link to="/enroll" className="btn btn-white btn-lg">Enroll Now — Free Demo</Link>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.60)', color: '#fff' }}>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
