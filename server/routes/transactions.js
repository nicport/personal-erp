const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const { getAllTransactions, getTransaction, postTransaction, runQuery, getQuery } = require('../db/dbUtils');

// GET all transactions
router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM transactions ORDER BY date ASC';
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
    const row = await getQuery(sql, []); 
    res.json({ count: row.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// GET all transactions from the current month
// WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
router.get('/income', async (req, res) => {
  const sql = `SELECT SUM(amount) AS total_amount FROM transactions`;
  try {
    const row = await getQuery(sql, []);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/monthlycashflow', async (req, res) => {
  const sql = `SELECT 
    SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) AS total_expense
  FROM transactions
  WHERE strftime('%Y/%m', date) = strftime('%Y/%m', 'now');`
  try {
    const result = await getQuery(sql, []);
    res.json(result);
  } catch (err) {
    res.status(500).json({error: err.message});
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
  const sqlInsert = "INSERT INTO transactions (date, description, amount, type, account, category) VALUES (?, ?, ?, ?, ?, ?)";

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
      // Check if transaction is a duplicate before committing to db - this will allow overlap in uploaded csvs without duplicates
      if (!duplicate) {
        await new Promise((resolve, reject) => {
          db.run(sqlInsert, [transaction.date, transaction.description, transaction.amount, transaction.type,
          transaction.account, transaction.category], (err) => {
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
    const transaction = await runQuery(sql, [req.params.id]);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (update) a transaction
router.put('/:id', async (req, res) => {
  const { description, amount, type } = req.body;
  const sql = `UPDATE transactions SET description = ?, amount = ?, type = ? WHERE id = ?`;
  try {
    const result = await runQuery(sql, [description, amount, type]);
     res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  const sql = `DELETE FROM transactions WHERE id = ?`;
  try {
    const result = await runQuery(sql, [req.params.id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;