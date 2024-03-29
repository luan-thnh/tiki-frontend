import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import CardList from '../CardList';
import { useDispatch, useSelector } from 'react-redux';
import { findAllProduct } from '../../../../../api/productApi';

const LIMIT_PRODUCTS = 20;

const PaginationList = ({ itemsPerPage }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      findAllProduct({
        limit: LIMIT_PRODUCTS,
        page: page,
      })
    );
  }, [page]);

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <>
      <CardList products={products?.data} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(products?.pagination?.totalPages)}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        pageLinkClassName="paginate__link"
        activeLinkClassName="paginate__link-active"
        previousLinkClassName="paginate__link-prev"
        nextLinkClassName="paginate__link-next"
        disabledLinkClassName="paginate__link-disable"
      />
    </>
  );
};

export default PaginationList;
