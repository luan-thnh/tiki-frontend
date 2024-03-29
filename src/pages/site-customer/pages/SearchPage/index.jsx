import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { findAllProductByName } from '../../../../api/productApi';
import CardList from '../../components/molecules/CardList';
import CardItem from '../../components/molecules/CardList/CardItem';

const SearchPage = () => {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const keyword = new URLSearchParams(search).get('q');
  const { searchProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(findAllProductByName({ productName: keyword, limit: 10 }));
  }, []);

  return (
    <div className="container">
      <p className="search__keyword">Từ khóa tìm kiếm: {keyword}</p>
      {/* <div class="row" id="filter">
        <form>
          <div class="form-group col-sm-3 col-xs-6">
            <select data-filter="make" class="filter-make filter form-control">
              <option value="">Select Make</option>
              <option value="">Show All</option>
            </select>
          </div>
          <div class="form-group col-sm-3 col-xs-6">
            <select data-filter="model" class="filter-model filter form-control">
              <option value="">Select Model</option>
              <option value="">Show All</option>
            </select>
          </div>
          <div class="form-group col-sm-3 col-xs-6">
            <select data-filter="type" class="filter-type filter form-control">
              <option value="">Select Type</option>
              <option value="">Show All</option>
            </select>
          </div>
          <div class="form-group col-sm-3 col-xs-6">
            <select data-filter="price" class="filter-price filter form-control">
              <option value="">Select Price Range</option>
              <option value="">Show All</option>
            </select>
          </div>
        </form>
      </div> */}
      <div className="card__list">
        {searchProducts?.map((product, index) => (
          <CardItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
