const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Setup database
const db = new sqlite3.Database('./foodies.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to the foodies database.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    people INTEGER NOT NULL
  )
`);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Routes

// Booking creation
app.post('/book', (req, res) => {
  const { name, phone, date, time, people } = req.body;
  db.run(
    `INSERT INTO bookings (name, phone, date, time, people) VALUES (?, ?, ?, ?, ?)`,
    [name, phone, date, time, people],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Booking created', bookingId: this.lastID });
    }
  );
});

// View all bookings
app.get('/bookings', (req, res) => {
  db.all(`SELECT * FROM bookings ORDER BY date, time`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Cancel booking
app.delete('/cancel/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM bookings WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled', id });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
