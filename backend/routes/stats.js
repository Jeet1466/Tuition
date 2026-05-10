const express = require('express');
const db      = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/stats  (admin dashboard stats)
router.get('/', auth, (req, res) => {
  const totalEnrollments   = db.prepare('SELECT COUNT(*) as c FROM enrollments').get().c;
  const pendingEnrollments = db.prepare("SELECT COUNT(*) as c FROM enrollments WHERE status='pending'").get().c;
  const totalResults       = db.prepare('SELECT COUNT(*) as c FROM results').get().c;
  const totalTestimonials  = db.prepare('SELECT COUNT(*) as c FROM testimonials').get().c;
  const totalContacts      = db.prepare('SELECT COUNT(*) as c FROM contacts').get().c;
  const unreadContacts     = db.prepare("SELECT COUNT(*) as c FROM contacts WHERE status='unread'").get().c;
  const recentEnrollments  = db.prepare("SELECT * FROM enrollments ORDER BY created_at DESC LIMIT 5").all();
  const recentContacts     = db.prepare("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5").all();

  res.json({
    totalEnrollments,
    pendingEnrollments,
    totalResults,
    totalTestimonials,
    totalContacts,
    unreadContacts,
    recentEnrollments,
    recentContacts,
  });
});

module.exports = router;
