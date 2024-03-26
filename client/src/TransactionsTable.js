import React, { useEffect } from 'react';
import { useTable } from 'react-table';
import { FixedSizeList as List } from 'react-window';

function TransactionsTable({ data, columns }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({ columns, data });
  
    const RenderRow = ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <tr {...row.getRowProps({ style })}>
          {row.cells.map(cell => {
            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
          })}
        </tr>
      );
    };
  
    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          <List
            height={400} // Adjust as needed
            itemCount={rows.length}
            itemSize={35} // Adjust based on the height of your rows
            width='100%'
          >
            {RenderRow}
          </List>
        </tbody>
      </table>
    );
  }

export default TransactionsTable;
