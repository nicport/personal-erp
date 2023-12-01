import React from 'react';

const TransactionCount = ({ count }) => {
  return (
    <div className='transaction-count'>
      <h6>Number of Transactions: {count}</h6>
    </div>
  );
};

export default TransactionCount;
