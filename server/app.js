const express = require("express");
const app = express();
const cors = require("cors");
const transactionsRoutes = require('./routes/transactions');
const tasksRoutes = require('./routes/tasks');
const db = require('./db/index.js');
const port = 5000;

app.use(cors());
app.use(express.json());

// Create transactions table if not exists
db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  amount REAL,
  type TEXT
);`);

/*
app.get("/api/transactions", (req, res) => {
  // Normally this data would come from the database
  const transactions = [
    { id: 1, description: "test", amount: -20 },
    { id: 2, description: "test2", amount: 3000 },
  ];

  res.json(transactions);
});
*/

app.use('/api/transactions', transactionsRoutes);
app.use('/api/tasks', tasksRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
