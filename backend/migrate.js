const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'data.db'));

try {
  db.exec('ALTER TABLE enrollments ADD COLUMN total_fees REAL DEFAULT 0');
  db.exec('ALTER TABLE enrollments ADD COLUMN paid_fees REAL DEFAULT 0');
  console.log('Migration successful');
} catch (e) {
  console.log('Migration error (might be already applied):', e.message);
}
