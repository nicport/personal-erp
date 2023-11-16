import React, { useState, useEffect } from 'react';
import TransactionsTable from './TransactionsTable';
import CSVUpload from './CSVUpload';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null); // add an error state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const transactionTypes = ["Income", "Travel", "Food", "Entertainment", "Health & Fitness"];

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
        Cell: ({ row, value }) => (
          <select
            value={value}
            onChange={(e) => handleTypeChange(e, row.index)}
          >
            {transactionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        ),
      },
      {
        Header: 'Tags',
        accessor: 'tags',
        Cell: ({ row, value }) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleTagsChange(e, row.index)}
          />
        ),
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

  const handleTypeChange = (event, rowIndex) => {
    const newTransactions = [...transactions];
    newTransactions[rowIndex] = {
      ...newTransactions[rowIndex],
      type: event.target.value,
    };
    setTransactions(newTransactions);
  };

  const handleTagsChange = (event, rowIndex) => {
    const newTransactions = [...transactions];
    newTransactions[rowIndex] = {
      ...newTransactions[rowIndex],
      tags: event.target.value,
    };
    setTransactions(newTransactions);
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

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : new Date(-8640000000000000);
    const end = endDate ? new Date(endDate) : new Date(8640000000000000);
    return transactionDate >= start && transactionDate <= end;
  });

  return (
    <div>
      <div className='toolbar'>
        <div className='csv-upload'>
          <CSVUpload onFileLoaded={handleCSVData} />
        </div>
        <div className='date-filter'>
          <h6>Date Range Filter:</h6>
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='display-data'>
        <div className='table'>
          {error && <p>Error: {error}</p>} {/* display error message to user */}
          <TransactionsTable data={filteredTransactions} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default App;