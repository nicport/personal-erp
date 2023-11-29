import React, { useState, useEffect } from 'react';

const TransactionCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/transactions/count')
      .then(response => response.json())
      .then(data => setCount(data.count))
      .catch(error => console.error('Error fetching count:', error));
  }, []);

  return (
    <div>
      <h6>Number of Transactions: {count}</h6>
    </div>
  );
};

export default TransactionCount;
