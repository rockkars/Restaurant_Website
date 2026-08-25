const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./foodies.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    date TEXT,
    time TEXT,
    people INTEGER
  )`);
});

module.exports = db;
