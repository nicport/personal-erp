const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const { getAllTransactions, getTransaction, postTransaction, updateTransaction, deleteTransaction, runQuery } = require('../db/dbUtils');

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

// return COUNT of transactions
router.get('/count', async (req, res) => {
  const sql = 'SELECT COUNT(*) as count FROM transactions';
  try {
    const row = await runQuery(sql, []); 
    res.json({ count: row.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

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
router.post('/bulk', async (req, res) => {
  const transactions = req.body.transactions;
  const sqlCheckDuplicate = `SELECT * FROM transactions WHERE date = ? AND description = ? AND amount = ?`;
  const sqlInsert = "INSERT INTO transactions (date, description, amount, type) VALUES (?, ?, ?, ?)";

  await db.serialize(async () => {
    await db.run("BEGIN TRANSACTION");

    for (const transaction of transactions) {
      const duplicate = await new Promise((resolve, reject) => {
        db.get(sqlCheckDuplicate, [transaction.date, transaction.description, transaction.amount], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });

      if (!duplicate) {
        await new Promise((resolve, reject) => {
          db.run(sqlInsert, [transaction.date, transaction.description, transaction.amount, transaction.type], (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    }

    await db.run("COMMIT");
  });

  res.json({ message: "Bulk transactions processed successfully!" });
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