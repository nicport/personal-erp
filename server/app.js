const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/transactions", (req, res) => {
  // Normally this data would come from the database
  const transactions = [
    { id: 1, description: "test", amount: -20 },
    { id: 2, description: "test2", amount: 3000 },
  ];

  res.json(transactions);
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
