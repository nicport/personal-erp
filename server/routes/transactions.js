const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const { getAllTransactions, getTransaction, postTransaction, updateTransaction, deleteTransaction } = require('../db/dbUtils');

// GET all transactions
router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM transactions';
  try {
    const rows = await getAllTransactions(sql, []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific transaction by id
router.get('/:id', async (req, res) => {
  const sql = `SELECT * FROM transactions WHERE id = ?`;
  try {
    const row = await getTransaction(sql, [req.params.id]);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  const { date, description, amount, type } = req.body;
  const sql = `INSERT INTO transactions (date, description, amount, type) VALUES (?, ?, ?, ?)`;

  try {
    res.json(await postTransaction(sql, [date, description, amount, type]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST bulk transactions
router.post('/bulk', (req, res) => {
  const transactions = req.body.transactions;
  const sqlCheckDuplicate = `SELECT * FROM transactions WHERE date = ? AND description = ? AND amount = ?`;
  const sqlInsert = "INSERT INTO transactions (date, description, amount, type) VALUES (?, ?, ?, ?)";

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    const stmt = db.prepare(sql);

    transactions.forEach((transaction) => {
      stmt.run([transaction.date, transaction.description, transaction.amount, null]);
    });

    stmt.finalize();
    db.run("COMMIT");
  });

  res.json({ message: "Bulk transactions inserted successfully!" });
});

// PUT (update) a transaction
router.put('/:id', async (req, res) => {
  const { description, amount, type } = req.body;
  const sql = `UPDATE transactions SET description = ?, amount = ?, type = ? WHERE id = ?`;

  try {
     res.json(await updateTransaction(sql, [description, amount, type]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  const sql = `DELETE FROM transactions WHERE id = ?`;

  try {
    res.json(await deleteTransaction(sql, [req.params.id]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;