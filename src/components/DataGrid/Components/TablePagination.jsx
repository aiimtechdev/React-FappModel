/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const TablePagination = ({ tableInstance }) => {
  const {
    gotoPage,
    canPreviousPage,
    pageCount,
    elements,
    previousPage,
    nextPage,
    canNextPage,
    totRecords,
    state: { pageIndex },
    initialState: { pageSize }
  } = tableInstance;
  if (pageCount <= 1) return <></>;
  
  let pageLimit = pageSize || 10;
  const [currentPage, setCurrentPage] = useState(0);

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 0) / pageLimit) * pageLimit;
    let pageArray = new Array(pageLimit).fill().map((_, idx) => start + idx + 1 )
    let filteredArray = pageArray.filter(e => e <= pageCount);
    return filteredArray;
  };
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);

  useEffect(() => {
    setFrom(pageIndex * pageSize + 1)
    let end = (pageIndex + 1) * pageSize
    setTo((end) < totRecords ? end : totRecords)
  }, [pageSize, pageIndex, totRecords])

  return (
    <div className='d-flex align-items-center justify-content-between mb-1'>
      <p className='m-0'>Showing {from} to {to} of {totRecords} {elements}</p>
      <Pagination className="mb-0">
        <Pagination.First className="shadow" onClick={() => {gotoPage(0);setCurrentPage(0)}} disabled={!canPreviousPage}>
          <CsLineIcons icon="arrow-double-left" />
        </Pagination.First>
        <Pagination.Prev className="shadow" disabled={!canPreviousPage} onClick={() => {previousPage(currentPage - 1 );setCurrentPage(currentPage - 1 )}}>
          <CsLineIcons icon="chevron-left" />
        </Pagination.Prev>
        {getPaginationGroup().map((x, i) =>{
            return (
              <Pagination.Item key={`pagination${x}`} className="shadow" active={ pageIndex+1 === x } onClick={() => {gotoPage(x-1);setCurrentPage(x-1)}} style={{width: x >= 100 ? '3rem' : '2rem' }}>
                {x}
              </Pagination.Item>
            )
        } )}
        <Pagination.Next className="shadow" onClick={() => {nextPage(currentPage + 1);setCurrentPage(currentPage + 1)}} disabled={!canNextPage}>
          <CsLineIcons icon="chevron-right" />
        </Pagination.Next>
        <Pagination.Last className="shadow" onClick={() => {gotoPage(pageCount - 1 );setCurrentPage(pageCount - 1 )}} disabled={!canNextPage}>
          <CsLineIcons icon="arrow-double-right" />
        </Pagination.Last>
      </Pagination>
    </div>
  );
};
export default TablePagination;
