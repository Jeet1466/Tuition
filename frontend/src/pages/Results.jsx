import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Results.css';
import './Courses.css';
import './Home.css';

const years = ['2024', '2023', '2022', '2021'];

const toppers = {
  2024: [
    { name: 'Arjun Verma', grade: 'HSC Science – Grade 12', pct: 97.8, rank: 1, initials: 'AV', color: '#00235A' },
    { name: 'Sneha Gupta', grade: 'SSC – Grade 10', pct: 96.2, rank: 2, initials: 'SG', color: '#FF5E14' },
    { name: 'Riya Shah', grade: 'HSC Commerce – Grade 12', pct: 95.6, rank: 3, initials: 'RS', color: '#03EC8D' },
    { name: 'Dev Patel', grade: 'SSC – Grade 10', pct: 94.8, rank: 4, initials: 'DP', color: '#1a4a8a' },
    { name: 'Ananya Joshi', grade: 'HSC Science – Grade 12', pct: 94.2, rank: 5, initials: 'AJ', color: '#cc4a0f' },
    { name: 'Kabir Singh', grade: 'Grade 8', pct: 93.8, rank: 6, initials: 'KS', color: '#00874f' },
  ],
  2023: [
    { name: 'Pooja Nair', grade: 'HSC Science – Grade 12', pct: 98.2, rank: 1, initials: 'PN', color: '#00235A' },
    { name: 'Rohan Mehta', grade: 'SSC – Grade 10', pct: 95.8, rank: 2, initials: 'RM', color: '#FF5E14' },
    { name: 'Priya Das', grade: 'HSC Commerce – Grade 12', pct: 95.0, rank: 3, initials: 'PD', color: '#03EC8D' },
    { name: 'Siddharth K', grade: 'Grade 9', pct: 93.5, rank: 4, initials: 'SK', color: '#1a4a8a' },
    { name: 'Meera Iyer', grade: 'HSC Science – Grade 11', pct: 92.4, rank: 5, initials: 'MI', color: '#cc4a0f' },
    { name: 'Aakash Patel', grade: 'SSC – Grade 10', pct: 91.8, rank: 6, initials: 'AP', color: '#00874f' },
  ],
};

const subjectResults = [
  { name: 'Mathematics', pct: 98, color: '#FF5E14' },
  { name: 'Science', pct: 96, color: '#03EC8D' },
  { name: 'English', pct: 94, color: '#00235A' },
  { name: 'Physics', pct: 95, color: '#FF5E14' },
  { name: 'Chemistry', pct: 93, color: '#03EC8D' },
  { name: 'Accountancy', pct: 97, color: '#1a4a8a' },
];

export default function Results() {
  const [activeYear, setActiveYear] = useState('2024');
  const currentToppers = toppers[activeYear] || toppers['2024'];

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="page-hero-breadcrumb">
              <Link to="/">Home</Link><span>›</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>Our Results</span>
            </div>
            <h1 className="page-hero-title">
              Proven Results, <span>Year After Year</span>
            </h1>
            <p className="page-hero-desc">
              Our students consistently achieve top scores in board exams. Here's the proof — real students, real results.
            </p>
            <div className="results-grid-hero">
              {[
                { val: '95', unit: '%', label: 'Board Pass Rate 2024' },
                { val: '150', unit: '+', label: 'Top 10 District Rankers' },
                { val: '97.8', unit: '%', label: 'Highest Score This Year' },
              ].map((s, i) => (
                <div key={i} className="result-hero-card">
                  <div className="result-hero-val">{s.val}<span>{s.unit}</span></div>
                  <div className="result-hero-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Toppers Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Hall of Fame</span>
            <h2 className="headline-lg section-title">Our Star Performers</h2>
            <p className="section-desc">Celebrating the students who made us proud.</p>
          </div>
          <div className="year-tabs">
            {years.map(y => (
              <button
                key={y}
                className={`year-tab ${activeYear === y ? 'active' : ''}`}
                onClick={() => setActiveYear(y)}
              >
                {y} Results
              </button>
            ))}
          </div>
          <div className="grid-3">
            {currentToppers.map((t, i) => (
              <div key={i} className="topper-card">
                <div className="topper-card-header">
                  <div className="topper-rank">#{t.rank}</div>
                  <div className="topper-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div className="topper-name">{t.name}</div>
                  <div className="topper-grade">{t.grade}</div>
                </div>
                <div className="topper-score">
                  <div className="topper-score-pct">{t.pct}<span>%</span></div>
                  <div className="topper-score-label">Board<br />Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject-wise Results */}
      <section className="section section-bg">
        <div className="container">
          <div className="grid-2" style={{ gap: 64, alignItems: 'start' }}>
            <div>
              <span className="section-label">Subject Analysis</span>
              <h2 className="headline-lg section-title">Average Scores by Subject</h2>
              <p className="section-desc" style={{ marginBottom: 32 }}>
                Our students consistently score above the state average across all subjects.
              </p>
              <div>
                {subjectResults.map((s, i) => (
                  <div key={i} className="subject-result-row">
                    <div className="subject-result-name">{s.name}</div>
                    <div className="subject-result-bar">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    </div>
                    <div className="subject-result-pct">{s.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card" style={{ padding: 32 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>📊</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>
                  Overall Statistics 2024
                </h3>
                {[
                  { label: 'Students who scored 90%+', val: '68%' },
                  { label: 'Students who scored 80%+', val: '89%' },
                  { label: 'Overall board pass rate', val: '97%' },
                  { label: 'Improvement from last year', val: '+3.2%' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--color-outline-var)' : 'none' }}>
                    <span style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>{s.label}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 800, color: 'var(--color-secondary)' }}>{s.val}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ background: 'var(--color-primary)', borderColor: 'transparent', padding: 32 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                  🏆 District Achievement Award 2024
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', lineHeight: 1.6, marginBottom: 16 }}>
                  Educating Minds was recognised as the Top Performing Tuition Institute in the Mumbai District for 3 consecutive years.
                </p>
                <span className="chip chip-mint">3 Years Running</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-title">Your Child Could Be Our Next Topper!</h2>
          <p className="cta-desc">
            Join Educating Minds and give your child the best possible chance at academic excellence.
          </p>
          <div className="cta-actions">
            <Link to="/enroll" className="btn btn-white btn-lg">Enroll for 2025 →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
