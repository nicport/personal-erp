import React, { useEffect, useState } from 'react';

const CashFlow = () => {
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0 });

  useEffect(() => {
    fetch('/monthly-cashflow') // Adjust with your actual API endpoint
      .then(response => response.json())
      .then(data => setSummary(data))
      .catch(error => console.error('There was an error!', error));
  }, []);

  return (
    <div>
      <h2>Monthly Summary</h2>
      <p>Income: ${summary.total_income}</p>
      <p>Expenses: ${summary.total_expense}</p>
      <p>Net: ${summary.total_income - summary.total_expense}</p>
    </div>
  );
};

export default CashFlow;