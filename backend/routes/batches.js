const express = require('express');
const db      = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/batches?stream=Junior  (public)
router.get('/', (req, res) => {
  const { stream } = req.query;
  let rows;
  if (stream) {
    rows = db.prepare('SELECT * FROM batches WHERE stream=? AND active=1 ORDER BY id').all(stream);
  } else {
    rows = db.prepare('SELECT * FROM batches WHERE active=1 ORDER BY stream, id').all();
  }
  res.json(rows);
});

// POST /api/batches  (admin)
router.post('/', auth, (req, res) => {
  const { time, type, days, seats_total, seats_taken, grade, stream } = req.body;
  if (!time || !type || !days) return res.status(400).json({ error: 'time, type, days required' });
  const result = db.prepare(`
    INSERT INTO batches (time, type, days, seats_total, seats_taken, grade, stream)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(time, type, days, seats_total||20, seats_taken||0, grade||'', stream||'Junior');
  res.json({ id: result.lastInsertRowid });
});

// PUT /api/batches/:id  (admin)
router.put('/:id', auth, (req, res) => {
  const { time, type, days, seats_total, seats_taken, grade, stream, active } = req.body;
  db.prepare(`
    UPDATE batches SET time=?, type=?, days=?, seats_total=?, seats_taken=?, grade=?, stream=?, active=?
    WHERE id=?
  `).run(time, type, days, seats_total, seats_taken, grade, stream, active !== undefined ? active : 1, req.params.id);
  res.json({ success: true });
});

// DELETE /api/batches/:id  (admin)
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM batches WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
