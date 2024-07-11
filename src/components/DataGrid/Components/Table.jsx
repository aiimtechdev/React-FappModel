/* eslint-disable no-plusplus */
import classNames from 'classnames';
import NoData from './NoData';
import React from 'react';

const Table = ({ tableInstance, className = 'react-table boxed', style }) => {
  const { data, getTableProps, headerGroups, page, getTableBodyProps, prepareRow, toggleAllPageRowsSelected, setIsOpenAddEditModal } = tableInstance;
  return (
    <>
      {
        data.length > 0 ?
          <table className={className} style={style} {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup, headerIndex) => (
                <tr key={`header${headerIndex}`} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => {
                    return (
                      <th
                        key={`th.${index}`}
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className={!column.sortable ? classNames(column.headerClassName) : classNames(column.headerClassName, {
                          sorting_desc: column.isSortedDesc,
                          sorting_asc: column.isSorted && !column.isSortedDesc,
                          sorting: column.sortable,
                        })}
                        role={column.sortable ? 'button' : 'columnheader'}
                        // style={{...column.headerStyles, ...(!column.sortable ? {pointerEvents: 'none'} : {})}}
                         style={{ ...(!column.sortable ? {pointerEvents: 'none'} : {})}}
                      >
                        {column.render('Header')}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
              return (
                  <tr key={`tr.${i}`} {...row.getRowProps()} className={classNames({ selected: row.isSelected })}>
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        key={`td.${cellIndex}`}
                        {...cell.getCellProps()}
                        onClick={() => {
                          if (cell.column.id === 'edit') {
                            toggleAllPageRowsSelected(false);
                            row.toggleRowSelected(true);
                            // setIsOpenAddEditModal(true);
                          } else {
                            row.toggleRowSelected(false);
                          }
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table> : <NoData tableInstance={tableInstance}/>
      }
    </>
  );
};
export default Table;
