import React, { useEffect, useState } from 'react';

import CardItem from './CardItem';
import './styles.scss';
import generateProductJson from '../../../pages/HomePage/abx';
import { useDispatch, useSelector } from 'react-redux';
import { findAllProduct } from '../../../../../api/productApi';
import PaginationList from '../PaginationList';

CardList.propTypes = {};

const cardSuggests = [
  {
    icon: 'https://salt.tikicdn.com/cache/w100/ts/personalish/f9/27/b5/3a8e2286a1c8fb91b67acc5ee35f82f0.png.webp',
    title: 'Dành cho bạn',
  },
  {
    icon: 'https://salt.tikicdn.com/cache/w100/ts/personalish/3e/da/53/391c37862ff5bd340b3fcf7d858a96dc.png.webp',
    title: 'Rẻ Mỗi Ngày',
  },
  {
    icon: 'https://salt.tikicdn.com/cache/w100/ts/personalish/d4/de/6f/412a517a5b52d5312b66a47c088daa2e.png.webp',
    title: 'Freeship',
  },
  {
    icon: 'https://salt.tikicdn.com/cache/w100/ts/personalish/1a/41/2f/bd05c095d72298752832dd5e87917c1c.png.webp',
    title: 'Astra Plus',
  },
  {
    icon: 'https://salt.tikicdn.com/cache/w100/ts/personalish/08/b8/5c/5c6327fd3cf12c534bff4a55dab2f12d.png.webp',
    title: 'Dịch vụ số',
  },
  {
    icon: 'https://salt.tikicdn.com/cache/w100/ts/personalish/0f/59/9d/215fa18ef72e430eefcbfe5355cab8e2.png.webp',
    title: 'Rẻ vô đối',
  },
];

function CardList({ products }) {
  const [isActive, setIsActive] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  // const handleScroll = () => {
  //   const position = window.pageYOffset;
  //   setScrollPosition(position);
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  return (
    <div className="card">
      <div className="card__container">
        <div className={`card__banner ${scrollPosition >= 370 ? 'fixed' : ''}`}>
          <div className="card__banner-wrapper">
            <h3 className="card--title">Gợi ý hôm nay</h3>
            <div className="card__suggest">
              {cardSuggests.map(({ icon, title }, index) => (
                <button
                  key={index}
                  className={`card__suggest-btn ${isActive === index ? 'active' : ''}`}
                  onClick={() => setIsActive(index)}
                >
                  <img src={icon} alt="" className="card__suggest-icon" />
                  <p className="card__suggest-title">{title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card__list">
          {products?.map((product, index) => (
            <CardItem key={index} product={product} />
          ))}
        </div>

        {/* <PaginationList itemsPerPage={16} /> */}
      </div>
    </div>
  );
}

export default CardList;
