import React from 'react';
import { Link } from 'react-router-dom';
import { SCREEN_URL } from '../../../../../../constants/screen';

function CardItem(props) {
  const { product } = props;
  const {
    productId,
    deliveryDay,
    discountProduct,
    thumbnailUrl,
    productName,
    priceNew,
    priceOdd,
    rating,
    soldProduct,
    urlPath,
  } = product;

  return (
    <Link
      to={SCREEN_URL.DETAILS.replace(':urlPath', urlPath).replace(':productId', productId)}
      className="card__item"
      data-id={productId}
    >
      <div className="card__item-thumbnail">
        <img src={thumbnailUrl} alt={productName} />
      </div>
      <div className="card__item-content">
        <p className="card__item-title">{productName}</p>
        <div className="card__item-rating-count">
          <div className="card__item-rating">
            <span>{rating}</span>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              size="14"
              color="#fdd836"
              height="14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: 'rgb(253, 216, 54)' }}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
          </div>
          <div className="card__item-count">Đã bán {soldProduct}</div>
        </div>
        <p className={`card__item-price ${discountProduct ? 'discount' : ''}`}>
          {(discountProduct ? priceNew : priceOdd).toLocaleString('vi', {
            style: 'currency',
            currency: 'VND',
          })}
          {discountProduct ? <span className="card__item-price--discount">{discountProduct}%</span> : ''}
        </p>
      </div>
      <div className="card__item-footer">
        <p>{deliveryDay}</p>
      </div>
    </Link>
  );
}

export default CardItem;
