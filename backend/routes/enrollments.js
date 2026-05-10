const express = require('express');
const db      = require('../db');
const auth    = require('../middleware/auth');
const waService = require('../services/whatsapp');
const router  = express.Router();

// POST /api/enrollments  (public – student submits form)
router.post('/', async (req, res) => {
  const { studentName, parentName, email, phone, grade, course, batch, message } = req.body;
  if (!studentName || !parentName || !email || !phone || !grade || !course)
    return res.status(400).json({ error: 'Required fields missing' });

  // Predefined Fees
  let totalFees = 0;
  const gradeNum = parseInt(grade.replace(/\D/g, ''));
  if (gradeNum >= 1 && gradeNum <= 8) totalFees = 8000;
  else if (gradeNum === 9 || gradeNum === 10) totalFees = 10000;
  else if (gradeNum === 11 || gradeNum === 12) totalFees = 12000;
  else totalFees = 8000; // default

  const result = db.prepare(`
    INSERT INTO enrollments (student_name, parent_name, email, phone, grade, course, batch, message, total_fees)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(studentName, parentName, email, phone, grade, course, batch||'', message||'', totalFees);
  
  // Automate WhatsApp messages
  await waService.sendEnrollmentAdminAlert(req.body);
  await waService.sendEnrollmentUserAck(req.body);

  res.json({ id: result.lastInsertRowid, message: 'Enrollment submitted successfully' });
});

// GET /api/enrollments  (admin)
router.get('/', auth, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  let rows, total;
  if (status) {
    rows  = db.prepare('SELECT * FROM enrollments WHERE status=? ORDER BY created_at DESC LIMIT ? OFFSET ?').all(status, Number(limit), offset);
    total = db.prepare('SELECT COUNT(*) as c FROM enrollments WHERE status=?').get(status).c;
  } else {
    rows  = db.prepare('SELECT * FROM enrollments ORDER BY created_at DESC LIMIT ? OFFSET ?').all(Number(limit), offset);
    total = db.prepare('SELECT COUNT(*) as c FROM enrollments').get().c;
  }
  res.json({ rows, total, page: Number(page), limit: Number(limit) });
});

// PUT /api/enrollments/:id/status  (admin)
router.put('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'contacted', 'enrolled', 'rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE enrollments SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// DELETE /api/enrollments/:id  (admin)
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM enrollments WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// PUT /api/enrollments/:id/fees (admin)
router.put('/:id/fees', auth, (req, res) => {
  const { total_fees, paid_fees } = req.body;
  db.prepare('UPDATE enrollments SET total_fees = ?, paid_fees = ? WHERE id = ?').run(total_fees, paid_fees, req.params.id);
  res.json({ success: true });
});

// POST /api/enrollments/trigger-fee-reminders (admin/system)
router.post('/trigger-fee-reminders', async (req, res) => {
  const pending = db.prepare('SELECT * FROM enrollments WHERE total_fees > paid_fees AND status = ?').all('enrolled');
  for (const student of pending) {
    await waService.sendFeeReminder(student);
  }
  res.json({ success: true, count: pending.length });
});

// POST /api/enrollments/:id/mock-pay (public - mock payment)
router.post('/:id/mock-pay', async (req, res) => {
  const { amount } = req.body;
  const student = db.prepare('SELECT * FROM enrollments WHERE id = ?').get(req.params.id);
  if (!student) return res.status(404).json({ error: 'Not found' });
  
  await waService.sendPaymentConfirmationToAdmin({
    studentName: student.student_name,
    enrollmentId: student.id,
    amount: amount
  });
  
  res.json({ success: true, message: 'Payment link processed, Admin notified.' });
});

module.exports = router;
