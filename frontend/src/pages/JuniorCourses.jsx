import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';

const juniorSubjects = [
  { icon: '\u{1F522}', name: 'Mathematics', desc: 'From basic arithmetic to algebra, geometry, and statistics with real-world applications.', pct: 98, color: 'rgba(255,94,20,0.12)' },
  { icon: '\u{1F52C}', name: 'Science', desc: 'Physics, Chemistry and Biology fundamentals with practical experiments and diagrams.', pct: 95, color: 'rgba(3,236,141,0.12)' },
  { icon: '\u{1F4D6}', name: 'English', desc: 'Grammar, comprehension, creative writing and spoken English to build confidence.', pct: 93, color: 'rgba(0,35,90,0.08)' },
  { icon: '\u{1F30D}', name: 'Social Studies', desc: 'History, Geography and Civics made engaging through storytelling and maps.', pct: 91, color: 'rgba(255,94,20,0.08)' },
  { icon: '\u{1F549}', name: 'Hindi', desc: 'Reading, writing and grammar - strengthening the mother tongue foundation.', pct: 90, color: 'rgba(3,236,141,0.08)' },
  { icon: '\u{1F4BB}', name: 'Computer Science', desc: 'Introduction to programming, MS Office, and digital literacy for modern learners.', pct: 94, color: 'rgba(0,35,90,0.12)' },
];

const juniorBatches = [
  { time: '7:00 AM – 9:00 AM', type: 'Morning Batch', days: 'Mon – Sat', seats: '4 Seats Left', fill: 80, grade: 'Gr. 1–5' },
  { time: '11:00 AM – 1:00 PM', type: 'Noon Batch', days: 'Mon – Sat', seats: '8 Seats Left', fill: 60, grade: 'Gr. 6–8' },
  { time: '4:00 PM – 6:00 PM', type: 'Evening Batch', days: 'Mon – Sat', seats: '12 Seats Left', fill: 40, grade: 'Gr. 9–10' },
  { time: '10:00 AM – 12:00 PM', type: 'Weekend Batch', days: 'Sat – Sun', seats: '6 Seats Left', fill: 70, grade: 'Gr. 6–10' },
];

const faqs = [
  { q: 'What is the minimum age to enroll?', a: 'We accept students from Grade 1 onwards. There is no age restriction — students of all learning speeds are welcome.' },
  { q: 'Are study materials provided?', a: 'Yes! Comprehensive notes, practice sheets, chapter-wise question banks, and previous year papers are all provided at no extra cost.' },
  { q: 'How are doubts handled outside class hours?', a: 'We offer dedicated doubt-solving sessions every Saturday. Students can also reach teachers via WhatsApp during designated hours.' },
  { q: 'What if my child misses a class?', a: 'Missed classes can be attended in the same week in a parallel batch. We also provide recorded notes and written summaries.' },
];

export default function JuniorCourses() {
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
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>Grades 1–10 & English</span>
            </div>
            <h1 className="page-hero-title">
              Grades 1–10 &amp; <span>English Batches</span>
            </h1>
            <p className="page-hero-desc">
              A solid academic foundation for every student. Expert teachers, proven methods,
              and personalised attention from primary to secondary education.
            </p>
            <div className="page-hero-chips">
              <span className="chip chip-mint">📚 6 Subjects</span>
              <span className="chip chip-orange">⏱ 2 hrs / day</span>
              <span className="chip chip-navy">🏆 95% Pass Rate</span>
              <span className="chip chip-mint">📅 Flexible Batches</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="courses-layout">
            {/* Left Column */}
            <div>
              {/* Subjects */}
              <div className="section-header">
                <span className="section-label">Curriculum</span>
                <h2 className="headline-lg section-title">Subjects We Cover</h2>
              </div>
              <div className="grid-2" style={{ marginBottom: 56 }}>
                {juniorSubjects.map((s, i) => (
                  <div key={i} className="subject-card">
                    <div className="subject-card-top">
                      <div className="subject-icon-lg" style={{ background: s.color }}>{s.icon}</div>
                      <span className="chip chip-navy">{s.pct}%</span>
                    </div>
                    <div className="subject-card-body">
                      <div className="subject-name">{s.name}</div>
                      <p className="subject-desc">{s.desc}</p>
                      <div className="subject-progress-label">
                        <span>Avg. Student Score</span>
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
                <p className="section-desc">Choose a time that works best for your child.</p>
              </div>
              <div className="grid-2" style={{ marginBottom: 56 }}>
                {juniorBatches.map((b, i) => (
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
                        <span className="batch-detail-label">Grade</span>
                        <span className="batch-detail-val">{b.grade}</span>
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
                  <div className="sidebar-fee-amount">₹1,800</div>
                  <div className="sidebar-fee-period">per subject / per month</div>
                </div>
                <div className="sidebar-features">
                  {[
                    'All study materials included',
                    'Regular mock tests & assessments',
                    'Dedicated doubt-solving sessions',
                    'Monthly parent-teacher meetings',
                    'WhatsApp teacher support',
                    'Flexible batch changes',
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
                  Ask a Question
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
