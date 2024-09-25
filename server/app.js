const express = require("express");
const app = express();
const cors = require("cors");
const transactionsRoutes = require('./routes/transactions');
const tasksRoutes = require('./routes/tasks');
const db = require('./db/index.js');
const port = 5000;

app.use(cors());
app.use(express.json());

// FOR DEVELOPMENT
db.run(`DROP TABLE IF EXISTS transactions`, (err) => {
  if (err) {
    // Handle error
    console.error(err.message);
    return;
  }

  // Create transactions table if not exists
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account TEXT,
    date DATE,
    description TEXT,
    amount REAL,
    type TEXT,
    category TEXT,
    UNIQUE(date, description, amount, account)
  );`, (err) => {
    if (err) {
      // Handle error
      console.error(err.message);
    }
  });
});

app.use('/api/transactions', transactionsRoutes);
// TO BE IMPLEMENTED
//app.use('/api/tasks', tasksRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
