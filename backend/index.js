require('dotenv').config();
const express      = require('express');
const cors         = require('cors');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/results',      require('./routes/results'));
app.use('/api/enrollments',  require('./routes/enrollments'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/batches',      require('./routes/batches'));
app.use('/api/contacts',     require('./routes/contacts'));
app.use('/api/stats',        require('./routes/stats'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Production Static Serving ────────────────────────────────────────────────
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Handles any requests that don't match the API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// ─── Automatic Fee Reminders ───────────────────────────────────────────────────
const waService = require('./services/whatsapp');
const db = require('./db');

// Run fee check every 24 hours
setInterval(async () => {
  try {
    const pendingStudents = db.prepare('SELECT * FROM enrollments WHERE total_fees > paid_fees AND status = ?').all('enrolled');
    for (const student of pendingStudents) {
      await waService.sendFeeReminder(student);
    }
    if (pendingStudents.length > 0) {
      console.log(`[SYSTEM] Sent ${pendingStudents.length} automated fee reminder WhatsApp messages.`);
    }
  } catch (err) {
    console.error('Error in automated fee reminders:', err);
  }
}, 24 * 60 * 60 * 1000); // Runs once a day

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Educating Minds API running on http://localhost:${PORT}`);
  console.log(`   Admin login: admin / admin123\n`);
});
