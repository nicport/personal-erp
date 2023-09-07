const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./test.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

module.exports = db;