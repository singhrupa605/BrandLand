import Pagination from "react-bootstrap/Pagination";
import React  from 'react';

const CustomPagination = ({ page, rowsPerPage, totalRows, setPage }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  let arrayOfPageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    arrayOfPageNumbers.push(i);
  }

  return (
    <Pagination className="float-md-end d-flex  pt-3 justify-content-center">
      <Pagination.First className="first" onClick={() => setPage(0)} />
      <Pagination.Prev
        disabled={totalPages === 1 || page === 0}
        onClick={() => setPage(page - 1)}
      />
      {arrayOfPageNumbers.map((num) => (
        <Pagination.Item
          key={num}
          active={num === page + 1}
          onClick={() => setPage(num - 1)}
        >
          {num}
        </Pagination.Item>
      ))}
      <Pagination.Next
        className="next"
        disabled={totalPages === 1 || page === totalPages - 1}
        onClick={() => setPage(page + 1)}/>
      <Pagination.Last onClick={() => setPage(totalPages - 1)} />
    </Pagination>
  );
};

export default CustomPagination;