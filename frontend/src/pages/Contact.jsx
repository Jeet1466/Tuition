import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';
import './Enroll.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } finally {
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="page-hero-breadcrumb">
              <Link to="/">Home</Link><span>›</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>Contact Us</span>
            </div>
            <h1 className="page-hero-title">
              Get in <span>Touch With Us</span>
            </h1>
            <p className="page-hero-desc">
              Have a question about courses, fees, or batches? We're here to help. Reach out and our team will respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="enroll-layout">
            {/* Form */}
            <div className="enroll-form-card">
              {!submitted ? (
                <>
                  <h2 className="enroll-form-title">Send Us a Message</h2>
                  <p className="enroll-form-sub">
                    Fill out the form and we'll get back to you within 24 hours.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row" style={{ marginBottom: 20 }}>
                      <div className="input-group">
                        <label className="input-label" htmlFor="c-name">Your Name *</label>
                        <input id="c-name" name="name" className="input-field" placeholder="Full name" required value={form.name} onChange={handleChange} />
                      </div>
                      <div className="input-group">
                        <label className="input-label" htmlFor="c-phone">Phone Number</label>
                        <input id="c-phone" name="phone" className="input-field" placeholder="10-digit number" value={form.phone} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="input-group" style={{ marginBottom: 20 }}>
                      <label className="input-label" htmlFor="c-email">Email Address *</label>
                      <input id="c-email" name="email" type="email" className="input-field" placeholder="your@email.com" required value={form.email} onChange={handleChange} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 20 }}>
                      <label className="input-label" htmlFor="c-subject">Subject *</label>
                      <select id="c-subject" name="subject" className="input-field" required value={form.subject} onChange={handleChange}>
                        <option value="">Select a topic</option>
                        <option>Course Information</option>
                        <option>Fee & Payment Query</option>
                        <option>Batch Timing Query</option>
                        <option>Enrollment Process</option>
                        <option>Complaint / Feedback</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: 32 }}>
                      <label className="input-label" htmlFor="c-message">Your Message *</label>
                      <textarea id="c-message" name="message" className="input-field" placeholder="Describe your query in detail..." required value={form.message} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                      Send Message →
                    </button>
                  </form>
                </>
              ) : (
                <div className="form-success">
                  <div className="form-success-icon">✉️</div>
                  <h2 className="form-success-title">Message Sent!</h2>
                  <p className="form-success-desc">
                    Thank you, <strong>{form.name}</strong>! We've received your message and will respond to <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="info-card">
                <h3 className="info-card-title">📍 Visit Us</h3>
                <p className="info-card-desc" style={{ marginBottom: 16 }}>
                  123 Knowledge Park, Near City Center<br />
                  Mumbai, Maharashtra – 400001
                </p>
                <div style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  textAlign: 'center',
                  border: '1px solid var(--color-outline-var)',
                }}>
                  <div style={{ fontSize: 32 }}>🗺️</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginTop: 8 }}>
                    Map View
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-on-surface-var)', marginTop: 4 }}>
                    Mumbai, Maharashtra
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3 className="info-card-title">📞 Quick Contact</h3>
                <div className="contact-quick">
                  <div className="contact-quick-item">
                    <div className="contact-quick-icon">📱</div>
                    <div>
                      <div className="contact-quick-label">Call / WhatsApp</div>
                      <div className="contact-quick-val">+91 98765 43210</div>
                    </div>
                  </div>
                  <div className="contact-quick-item">
                    <div className="contact-quick-icon">✉️</div>
                    <div>
                      <div className="contact-quick-label">Email</div>
                      <div className="contact-quick-val">info@educatingminds.in</div>
                    </div>
                  </div>
                  <div className="contact-quick-item">
                    <div className="contact-quick-icon">⏰</div>
                    <div>
                      <div className="contact-quick-label">Office Hours</div>
                      <div className="contact-quick-val">Mon–Sat: 7 AM – 9 PM</div>
                    </div>
                  </div>
                  <div className="contact-quick-item">
                    <div className="contact-quick-icon">📅</div>
                    <div>
                      <div className="contact-quick-label">Walk-in Available</div>
                      <div className="contact-quick-val">No appointment needed</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-card" style={{ background: 'linear-gradient(135deg, var(--color-secondary), #ff7a3d)', border: 'none' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>💬</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>
                  WhatsApp Us Now
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', lineHeight: 1.6, marginBottom: 16 }}>
                  Chat directly with our admission team for the fastest response.
                </p>
                <a href="#" className="btn btn-white btn-sm" style={{ display: 'inline-flex' }}>
                  Open WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
