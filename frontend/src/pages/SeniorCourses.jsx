import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';

const streams = [
  {
    name: 'Science Stream',
    icon: '🔬',
    color: 'rgba(3,236,141,0.12)',
    subjects: [
      { icon: '⚡', name: 'Physics', desc: 'Mechanics, Optics, Electricity, Modern Physics — concept-to-application approach.', pct: 96 },
      { icon: '🧪', name: 'Chemistry', desc: 'Physical, Organic & Inorganic Chemistry with lab practicals and reaction mastery.', pct: 94 },
      { icon: '🧬', name: 'Biology', desc: 'Botany, Zoology, Human Physiology and Ecology with detailed diagram techniques.', pct: 97 },
      { icon: '🔢', name: 'Mathematics', desc: 'Calculus, Vectors, Probability and Co-ordinate Geometry for Engineering aspirants.', pct: 93 },
    ],
  },
  {
    name: 'Commerce Stream',
    icon: '📈',
    color: 'rgba(255,94,20,0.10)',
    subjects: [
      { icon: '📒', name: 'Accountancy', desc: 'Financial Accounting, Partnership, Company Accounts — step-by-step with practice.', pct: 95 },
      { icon: '💹', name: 'Economics', desc: 'Micro & Macro Economics, Indian Economic Development with diagram-based answers.', pct: 92 },
      { icon: '🏢', name: 'Business Studies', desc: 'Management, Marketing, Finance and Entrepreneurship for competitive exams.', pct: 91 },
      { icon: '🔢', name: 'Mathematics', desc: 'Statistics, Linear Programming and Probability for commerce students.', pct: 90 },
    ],
  },
];

const seniorBatches = [
  { time: '6:00 AM – 9:00 AM', type: 'Early Morning Batch', days: 'Mon – Sat', seats: '3 Seats Left', fill: 85, stream: 'Science' },
  { time: '12:00 PM – 3:00 PM', type: 'Afternoon Batch', days: 'Mon – Sat', seats: '7 Seats Left', fill: 65, stream: 'Commerce' },
  { time: '5:00 PM – 8:00 PM', type: 'Evening Batch', days: 'Mon – Sat', seats: '5 Seats Left', fill: 75, stream: 'Both' },
  { time: '9:00 AM – 12:00 PM', type: 'Weekend Intensive', days: 'Sat – Sun', seats: '10 Seats Left', fill: 50, stream: 'Both' },
];

const faqs = [
  { q: 'Do you cover competitive exam preparation?', a: 'Yes! Our HSC program is aligned with both board exams and JEE/NEET/CA-CPT entrance preparation. We run separate crash courses for these.' },
  { q: 'Are practicals and lab work covered?', a: 'Absolutely. Science students get hands-on practical training and file preparation for board practical exams, with detailed diagram techniques.' },
  { q: 'What is the teacher-to-student ratio?', a: 'We maintain a maximum of 15 students per batch to ensure personalised attention. HSC batches are often even smaller.' },
  { q: 'Are previous year board papers practiced?', a: 'Yes! Last 10 years board papers are covered, with chapter-wise analysis and marking scheme guidance for maximum score.' },
];

export default function SeniorCourses() {
  const [activeStream, setActiveStream] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="page-hero-breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <Link to="/courses">Courses</Link>
              <span>›</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>HSC 11–12th</span>
            </div>
            <h1 className="page-hero-title">
              HSC 11–12th <span>Science &amp; Commerce</span>
            </h1>
            <p className="page-hero-desc">
              Crack board exams and competitive entrances with expert faculty,
              comprehensive notes, and intensive practice sessions.
            </p>
            <div className="page-hero-chips">
              <span className="chip chip-mint">🎓 2 Streams</span>
              <span className="chip chip-orange">⏱ 3 hrs / day</span>
              <span className="chip chip-navy">🏆 Top Board Rankers</span>
              <span className="chip chip-mint">🔬 JEE/NEET Prep</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="courses-layout">
            {/* Left */}
            <div>
              {/* Stream Tabs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
                {streams.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStream(i)}
                    className={activeStream === i ? 'btn btn-primary' : 'btn btn-secondary'}
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>

              <div className="section-header">
                <span className="section-label">Curriculum</span>
                <h2 className="headline-lg section-title">
                  {streams[activeStream].name} — Subjects
                </h2>
              </div>
              <div className="grid-2" style={{ marginBottom: 56 }}>
                {streams[activeStream].subjects.map((s, i) => (
                  <div key={i} className="subject-card">
                    <div className="subject-card-top">
                      <div className="subject-icon-lg" style={{ background: streams[activeStream].color }}>
                        {s.icon}
                      </div>
                      <span className="chip chip-navy">{s.pct}%</span>
                    </div>
                    <div className="subject-card-body">
                      <div className="subject-name">{s.name}</div>
                      <p className="subject-desc">{s.desc}</p>
                      <div className="subject-progress-label">
                        <span>Avg. Board Score</span>
                        <span>{s.pct}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Batches */}
              <div className="section-header">
                <span className="section-label">Schedule</span>
                <h2 className="headline-lg section-title">Available Batches</h2>
                <p className="section-desc">Seats are limited per batch. Enroll early to secure your preferred slot.</p>
              </div>
              <div className="grid-2" style={{ marginBottom: 56 }}>
                {seniorBatches.map((b, i) => (
                  <div key={i} className="batch-card">
                    <div className="batch-time">
                      <div className="batch-time-icon">⏰</div>
                      <div>
                        <div className="batch-time-val">{b.time}</div>
                        <div className="batch-time-type">{b.type}</div>
                      </div>
                    </div>
                    <div className="batch-details">
                      <div className="batch-detail">
                        <span className="batch-detail-label">Days</span>
                        <span className="batch-detail-val">{b.days}</span>
                      </div>
                      <div className="batch-detail">
                        <span className="batch-detail-label">Stream</span>
                        <span className="batch-detail-val">{b.stream}</span>
                      </div>
                    </div>
                    <div className="batch-seats" style={{ marginTop: 14 }}>
                      <div className="batch-seats-bar">
                        <div className="batch-seats-fill" style={{ width: `${b.fill}%` }} />
                      </div>
                      <span className="batch-seats-label">{b.seats}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <div className="section-header">
                <span className="section-label">FAQ</span>
                <h2 className="headline-lg section-title">Frequently Asked Questions</h2>
              </div>
              {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                  <button
                    className={`faq-question ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {f.q}
                    <span className="faq-chevron">▾</span>
                  </button>
                  <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>{f.a}</div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sidebar-card">
                <div className="sidebar-fee">
                  <div className="sidebar-fee-label">Monthly Fee</div>
                  <div className="sidebar-fee-amount">₹2,800</div>
                  <div className="sidebar-fee-period">per subject / per month</div>
                </div>
                <div className="sidebar-features">
                  {[
                    'Full NCERT + Board syllabus',
                    'Chapter-wise tests & model papers',
                    'JEE / NEET / CA prep included',
                    'Board practical file preparation',
                    'Last 10 year papers solved',
                    'Dedicated counselling sessions',
                  ].map((f, i) => (
                    <div key={i} className="sidebar-feature">
                      <div className="sidebar-feature-check">✓</div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/enroll" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}>
                  Enroll Now →
                </Link>
                <Link to="/contact" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Book Free Demo
                </Link>
                <div style={{ marginTop: 20, padding: '14px 0 0', borderTop: '1px solid var(--color-outline-var)', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--color-on-surface-var)' }}>📞 Call for free demo class</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: 'var(--color-primary)', marginTop: 4 }}>
                    +91 98765 43210
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
