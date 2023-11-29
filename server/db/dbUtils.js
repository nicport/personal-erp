// dbUtils.js
const db = require('./index.js');

const getAllTransactions = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getTransaction = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, [params], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  })
}

const postTransaction = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, message: "Transaction inserted successfully" });
      }
    });
  })
}

const updateTransaction = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, [params], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  })
}

const deleteTransaction = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, [params], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  })
}

const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getAllTransactions,
  getTransaction,
  postTransaction,
  updateTransaction,
  deleteTransaction,
  runQuery
};
