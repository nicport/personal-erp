import React, { useState, useEffect } from 'react';
import TransactionsTable from './TransactionsTable';
import CSVUpload from './CSVUpload';
import './App.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null); // add an error state
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      // ... add more columns as needed
    ],
    []
  );

  useEffect(() => {
    fetch('http://localhost:5000/api/transactions')
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Error fetching transactions');
        }
        })
      .then((data) => setTransactions(data))
      .catch((error) => setError(error.toString()));
  }, []);

  return (
    <div>
      <CSVUpload />
      <div className='table'>
        {error && <p>Error: {error}</p>} {/* display error message to user */}
        <TransactionsTable data={transactions} columns={columns} />
      </div>
    </div>
  );
};

export default App;