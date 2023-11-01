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
      {
        Header: 'Type',
        accessor: 'type',
      },
    ],
    []
  );

  const handleCSVData = (parsedData) => {
    const cleanedData = parsedData.map(entry => ({
      date: entry.Date,
      description: entry.Name,
      amount: entry.Amount
    }));
    fetch('http://localhost:5000/api/transactions/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transactions: cleanedData })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message);
      // Optionally, you can fetch the transactions again here
      // or update your state with the newly added transactions.
    })
    .catch(error => {
      setError(error.toString());
      console.error('Error posting transactions:', error);
    });
  };

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
      <CSVUpload onFileLoaded={handleCSVData} />
      <div className='table'>
        {error && <p>Error: {error}</p>} {/* display error message to user */}
        <TransactionsTable data={transactions} columns={columns} />
      </div>
    </div>
  );
};

export default App;