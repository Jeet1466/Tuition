const express = require('express');
const db      = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/contacts  (admin)
router.get('/', auth, (req, res) => {
  const { status } = req.query;
  const rows = status
    ? db.prepare('SELECT * FROM contacts WHERE status=? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.json(rows);
});

// POST /api/contacts  (public)
router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email, message required' });
  const result = db.prepare(`
    INSERT INTO contacts (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, email, phone||'', subject||'', message);
  res.json({ id: result.lastInsertRowid, message: 'Message sent successfully' });
});

// PUT /api/contacts/:id/status  (admin)
router.put('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// DELETE /api/contacts/:id  (admin)
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
