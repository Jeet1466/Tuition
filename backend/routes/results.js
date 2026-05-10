const express = require('express');
const db      = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/results?year=2024  (public)
router.get('/', (req, res) => {
  const { year } = req.query;
  let rows;
  if (year) {
    rows = db.prepare('SELECT * FROM results WHERE year = ? ORDER BY rank ASC').all(Number(year));
  } else {
    rows = db.prepare('SELECT * FROM results ORDER BY year DESC, rank ASC').all();
  }
  res.json(rows);
});

// GET /api/results/years  (public – distinct years)
router.get('/years', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT year FROM results ORDER BY year DESC').all();
  res.json(rows.map(r => r.year));
});

// POST /api/results  (admin)
router.post('/', auth, (req, res) => {
  const { name, grade, percentage, year, stream, initials, color, rank } = req.body;
  if (!name || !grade || !percentage || !year)
    return res.status(400).json({ error: 'name, grade, percentage, year are required' });
  const result = db.prepare(`
    INSERT INTO results (name, grade, percentage, year, stream, initials, color, rank)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, grade, percentage, year, stream||'General', initials||name.substring(0,2).toUpperCase(), color||'#00235A', rank||1);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

// PUT /api/results/:id  (admin)
router.put('/:id', auth, (req, res) => {
  const { name, grade, percentage, year, stream, initials, color, rank } = req.body;
  db.prepare(`
    UPDATE results SET name=?, grade=?, percentage=?, year=?, stream=?, initials=?, color=?, rank=?
    WHERE id=?
  `).run(name, grade, percentage, year, stream, initials, color, rank, req.params.id);
  res.json({ success: true });
});

// DELETE /api/results/:id  (admin)
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM results WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
