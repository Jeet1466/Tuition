const express = require('express');
const db      = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/testimonials  (public – active only)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM testimonials WHERE active=1 ORDER BY created_at DESC').all();
  res.json(rows);
});

// GET /api/testimonials/all  (admin)
router.get('/all', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
  res.json(rows);
});

// POST /api/testimonials  (admin)
router.post('/', auth, (req, res) => {
  const { quote, name, grade, initials, color, stars } = req.body;
  if (!quote || !name || !grade) return res.status(400).json({ error: 'quote, name, grade required' });
  const result = db.prepare(`
    INSERT INTO testimonials (quote, name, grade, initials, color, stars)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(quote, name, grade, initials || name.substring(0,2).toUpperCase(), color || '#00235A', stars || 5);
  res.json({ id: result.lastInsertRowid });
});

// PUT /api/testimonials/:id  (admin)
router.put('/:id', auth, (req, res) => {
  const { quote, name, grade, initials, color, stars, active } = req.body;
  db.prepare(`
    UPDATE testimonials SET quote=?, name=?, grade=?, initials=?, color=?, stars=?, active=?
    WHERE id=?
  `).run(quote, name, grade, initials, color, stars, active !== undefined ? active : 1, req.params.id);
  res.json({ success: true });
});

// DELETE /api/testimonials/:id  (admin)
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
