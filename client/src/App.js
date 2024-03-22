import React, { useState, useEffect } from 'react';
import TransactionsTable from './TransactionsTable';
import CSVUpload from './CSVUpload';
import Navbar from './components/Navbar';
import TransactionCount from './components/TransactionCount';
import CashFlow from './components/CashFlow';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null); // add an error state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionCount, setTransactionCount] = useState(0); 

  const updateCount = () => {
    // Fetch the new count and update state
    fetch('http://localhost:5000/api/transactions/count')
      .then(response => response.json())
      .then(data => setTransactionCount(data.count))
      .catch(error => console.error('Error fetching count:', error));
  };

  useEffect(() => {
    updateCount();
  }, [transactions]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Account',
        accessor: 'account',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Category',
        accessor: 'category',
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
    [],
  );

  const handleCSVData = async (parsedData) => {
    const cleanedData = parsedData.map(entry => ({
      date: entry.Date,
      description: entry.Name,
      type: entry.Type !== "" ? entry.Type : (entry.Amount > 0 ? "Income" : "Expense"),
      amount: entry.Amount,
      account: entry.Account,
      category: entry.Category
    }));

    try {
      const response =  await fetch('http://localhost:5000/api/transactions/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transactions: cleanedData })
      });

      if (!response.ok) {
        throw new Error('There was an issue with the /bulk api')
      }

      await response.json(); // wait for server to process request
      setTransactions(previousTransactions => [...previousTransactions, ...cleanedData]);
    } catch (error) {
      setError(error.toString());
      console.error('Error posting transactions:', error);
    }

  };

  const handleTagsChange = (event, rowIndex) => {
    setTransactions(transactions =>
      transactions.map((transaction, index) =>
        index === rowIndex ? { ...transaction, tags: event.target.value } : transaction
      )
    );
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

  const filterTransactionsByDate = (transactions, startDate, endDate) => {
    const start = startDate ? new Date(startDate) : new Date(-8640000000000000);
    const end = endDate ? new Date(endDate) : new Date(8640000000000000);
  
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  const filteredTransactions = filterTransactionsByDate(transactions, startDate, endDate);

  return (
    <>
      <Navbar />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-4'>
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
            <CashFlow />
          </div>

          <div className='col-8'>
            <TransactionCount count={transactionCount}/>
            <div className='table'>
              {error && <p>Error: {error}</p>} {/* display error message to user */}
              <TransactionsTable data={filteredTransactions} columns={columns} onTableChange={updateCount} />
            </div>
          </div>
        </div>
      </div>

        
    </>
  );
};

export default App;