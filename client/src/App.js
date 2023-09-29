import React, { useState, useEffect } from 'react';
import TransactionsTable from './TransactionsTable';
import CSVUpload from './CSVUpload';
import './App.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null); // add an error state

  useEffect(() => {
    fetch('http://localhost:5000/api/transactions')
      .then((res) => {
        if (res.ok) {
          res.json();
        } else {
          throw new Error('Error fetching transactions');
        }
        res.json()
        })
      .then((data) => setTransactions(data))
      .catch((error) => setError(error.toString()));
  }, []);

  return (
    <div className='table'>
      {error && <p>Error: {error}</p>} {/* display error message to user */}
      <CSVUpload />
      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default App;