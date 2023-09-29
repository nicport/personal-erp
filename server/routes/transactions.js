const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

// GET all transactions
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM transactions';
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// GET a specific transaction by id
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM transactions WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      throw err;
    }
    res.json(row);
  });
});

// POST a new transaction
router.post('/', (req, res) => {
  const { description, amount, type } = req.body;
  const sql = `INSERT INTO transactions (date, description, amount, type) VALUES (?, ?, ?)`;
  db.run(sql, [description, amount, type], function (err) {
    if (err) {
      throw err;
    }
    res.json({ id: this.lastID });
  });
});

// POST bulk transactions
router.post('/bulk', (req, res) => {
  const transactions = req.body.transactions;
  const sql = "INSERT INTO transactions (date, description, amount) VALUES (?, ?, ?)";
  
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    const stmt = db.prepare(sql);

    transactions.forEach(([date, description, amount]) => {
      stmt.run([date, description, amount]);
    });

    stmt.finalize();
    db.run("COMMIT");
  });

  res.json({ message: "Bulk transactions inserted successfully!" });
});

// PUT (update) a transaction
router.put('/:id', (req, res) => {
  const { description, amount, type } = req.body;
  const sql = `UPDATE transactions SET description = ?, amount = ?, type = ? WHERE id = ?`;
  db.run(sql, [description, amount, type, req.params.id], function (err) {
    if (err) {
      throw err;
    }
    res.json({ changes: this.changes });
  });
});

// DELETE a transaction
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM transactions WHERE id = ?`;
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      throw err;
    }
    res.json({ changes: this.changes });
  });
});

module.exports = router;