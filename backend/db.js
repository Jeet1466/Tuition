const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const PERSISTENT_DIR = process.env.PERSISTENT_STORAGE_DIR || __dirname;
const DB_PATH = path.join(PERSISTENT_DIR, 'data.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ───────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT    UNIQUE NOT NULL,
    password  TEXT    NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS results (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    grade      TEXT    NOT NULL,
    percentage REAL    NOT NULL,
    year       INTEGER NOT NULL,
    stream     TEXT    DEFAULT 'General',
    initials   TEXT,
    color      TEXT    DEFAULT '#00235A',
    rank       INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    parent_name  TEXT NOT NULL,
    email        TEXT NOT NULL,
    phone        TEXT NOT NULL,
    grade        TEXT NOT NULL,
    course       TEXT NOT NULL,
    batch        TEXT,
    message      TEXT,
    status       TEXT DEFAULT 'pending',
    total_fees   REAL DEFAULT 0,
    paid_fees    REAL DEFAULT 0,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    quote      TEXT    NOT NULL,
    name       TEXT    NOT NULL,
    grade      TEXT    NOT NULL,
    initials   TEXT,
    color      TEXT    DEFAULT '#00235A',
    stars      INTEGER DEFAULT 5,
    active     INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT,
    subject    TEXT,
    message    TEXT NOT NULL,
    status     TEXT DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS batches (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    time        TEXT    NOT NULL,
    type        TEXT    NOT NULL,
    days        TEXT    NOT NULL,
    seats_total INTEGER DEFAULT 20,
    seats_taken INTEGER DEFAULT 0,
    grade       TEXT,
    stream      TEXT    DEFAULT 'Junior',
    active      INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// ─── Seed default admin ────────────────────────────────────────────────────────
const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hash);
  console.log('✅ Default admin created: admin / admin123');
}

// ─── Seed sample results ──────────────────────────────────────────────────────
const resultsCount = db.prepare('SELECT COUNT(*) as c FROM results').get().c;
if (resultsCount === 0) {
  const insert = db.prepare(`
    INSERT INTO results (name, grade, percentage, year, stream, initials, color, rank)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const sampleResults = [
    ['Arjun Verma',  'HSC Science – Grade 12', 97.8, 2024, 'Science',  'AV', '#00235A', 1],
    ['Sneha Gupta',  'SSC – Grade 10',          96.2, 2024, 'General',  'SG', '#FF5E14', 2],
    ['Riya Shah',    'HSC Commerce – Grade 12', 95.6, 2024, 'Commerce', 'RS', '#03EC8D', 3],
    ['Dev Patel',    'SSC – Grade 10',          94.8, 2024, 'General',  'DP', '#1a4a8a', 4],
    ['Ananya Joshi', 'HSC Science – Grade 12',  94.2, 2024, 'Science',  'AJ', '#cc4a0f', 5],
    ['Kabir Singh',  'Grade 8',                 93.8, 2024, 'Junior',   'KS', '#00874f', 6],
    ['Pooja Nair',   'HSC Science – Grade 12',  98.2, 2023, 'Science',  'PN', '#00235A', 1],
    ['Rohan Mehta',  'SSC – Grade 10',          95.8, 2023, 'General',  'RM', '#FF5E14', 2],
    ['Priya Das',    'HSC Commerce – Grade 12', 95.0, 2023, 'Commerce', 'PD', '#03EC8D', 3],
  ];
  sampleResults.forEach(r => insert.run(...r));
  console.log('✅ Sample results seeded');
}

// ─── Seed sample testimonials ─────────────────────────────────────────────────
const testCount = db.prepare('SELECT COUNT(*) as c FROM testimonials').get().c;
if (testCount === 0) {
  const ins = db.prepare(`INSERT INTO testimonials (quote, name, grade, initials, color, stars) VALUES (?,?,?,?,?,?)`);
  [
    ['My daughter went from 65% to 92% in just one academic year. The teachers here are exceptional and truly care about each student.', 'Priya Sharma', 'Parent of Grade 9 Student', 'PS', '#FF5E14', 5],
    ['I cleared HSC Science with distinction and got into my dream engineering college. Educating Minds played a huge role in that success.', 'Rahul Mehta', 'HSC Science – 94%', 'RM', '#00235A', 5],
    ['The personalised attention and regular mock tests gave my son the confidence he needed. Best tuition centre in the city!', 'Anjali Patel', 'Parent of Grade 12 Student', 'AP', '#03EC8D', 5],
  ].forEach(t => ins.run(...t));
  console.log('✅ Sample testimonials seeded');
}

// ─── Seed sample batches ──────────────────────────────────────────────────────
const batchCount = db.prepare('SELECT COUNT(*) as c FROM batches').get().c;
if (batchCount === 0) {
  const ins = db.prepare(`INSERT INTO batches (time, type, days, seats_total, seats_taken, grade, stream) VALUES (?,?,?,?,?,?,?)`);
  [
    ['7:00 AM – 9:00 AM',   'Morning Batch',         'Mon – Sat', 20, 16, 'Gr. 1–5',  'Junior'],
    ['11:00 AM – 1:00 PM',  'Noon Batch',            'Mon – Sat', 20, 12, 'Gr. 6–8',  'Junior'],
    ['4:00 PM – 6:00 PM',   'Evening Batch',         'Mon – Sat', 20,  8, 'Gr. 9–10', 'Junior'],
    ['10:00 AM – 12:00 PM', 'Weekend Batch',         'Sat – Sun', 15, 10, 'Gr. 6–10', 'Junior'],
    ['6:00 AM – 9:00 AM',   'Early Morning Batch',   'Mon – Sat', 15, 13, 'Gr. 11–12','Senior'],
    ['12:00 PM – 3:00 PM',  'Afternoon Batch',       'Mon – Sat', 15, 10, 'Gr. 11–12','Senior'],
    ['5:00 PM – 8:00 PM',   'Evening Batch',         'Mon – Sat', 15, 11, 'Gr. 11–12','Senior'],
    ['9:00 AM – 12:00 PM',  'Weekend Intensive',     'Sat – Sun', 20, 10, 'Gr. 11–12','Senior'],
  ].forEach(b => ins.run(...b));
  console.log('✅ Sample batches seeded');
}

module.exports = db;
