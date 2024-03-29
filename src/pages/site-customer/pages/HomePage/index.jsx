import React, { useEffect, useState } from 'react';
import CardList from '../../components/molecules/CardList';
import { generateCategoriesJson } from './abx';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style.scss';

import { Autoplay, Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { findAllProduct } from '../../../../api/productApi';
import { useDispatch, useSelector } from 'react-redux';

const sliderUrls = [
  { id: 1, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/d4/7a/09/a27e8ba4470c3f6159c6884859ec3fe1.png.webp' },
  { id: 2, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/35/6c/58/61212f7f5d7b83f6780e39f9418f0374.jpg.webp' },
  { id: 3, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/07/df/a1/556da3659a94abe9c953bce892691ebf.png.webp' },
  { id: 4, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/62/a1/4c/6b281bf51f22e3dadb69768cc2dfc688.png.webp' },
  { id: 5, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/de/9d/6a/3433771b443e40d8a4cebf6625e5dd44.png.webp' },
  { id: 6, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/44/89/06/5bfa1c3ba97ea917b31337cda1ea5872.png.webp' },
  { id: 7, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/e5/7a/7b/0de389bea2a0189c0ed5312688e6b27e.png.webp' },
];

const LIMIT_PRODUCTS = 20;

function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    dispatch(
      findAllProduct({
        limit: LIMIT_PRODUCTS + page,
      })
    );
  }, [page]);

  const handleSeeMore = () => {
    setPage(page + 20);
  };

  useEffect(() => {
    generateCategoriesJson();

    const categoriesStorage = JSON.parse(localStorage.getItem('data_categories'));

    setCategories(categoriesStorage);
  }, []);

  return (
    <main id="main" className="main">
      <div className="container home">
        <div className="home__sidebar">
          <div className="home__sidebar-box">
            <h4 className="home__sidebar-title">Nổi bật</h4>
            <div className="home__sidebar-list home__outstanding">
              {categories['outstanding']?.map(({ id, icon, name }) => (
                <Link key={id} to="" className="home__sidebar-link" title={name} data-category={id}>
                  <img src={icon} alt="" className="home__sidebar-icon" />
                  <span className="home__sidebar-text">{name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="home__sidebar-box">
            <h4 className="home__sidebar-title">Danh mục</h4>
            <div className="home__sidebar-list home__categories">
              {categories['categories']?.map(({ id, icon, name }) => (
                <Link key={id} to="" className="home__sidebar-link" title={name} data-category={id}>
                  <img src={icon} alt="" className="home__sidebar-icon" />
                  <span className="home__sidebar-text">{name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="home__sidebar-box">
            <div className="home__sidebar-list">
              <a href="#!" className="home__sidebar-link" title="Bán hàng cùng Tiki">
                <img
                  src="https://salt.tikicdn.com/cache/100x100/ts/upload/08/2f/14/fd9d34a8f9c4a76902649d04ccd9bbc5.png.webp"
                  alt=""
                  className="home__sidebar-icon"
                />
                <span className="home__sidebar-text">Bán hàng cùng Tiki</span>
              </a>
            </div>
          </div>
        </div>

        <div className="home__body">
          <div className="home__slider">
            <div className="home__slider-list">
              <Swiper
                cssMode={true}
                navigation={true}
                mousewheel={true}
                keyboard={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
                className="slider slider__one"
              >
                {sliderUrls.map(({ id, url }) => (
                  <SwiperSlide key={id}>
                    <a href="#!" className="slider__link">
                      <img src={url} alt="" />
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="home__slider-image">
              <img
                src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/d0/65/36/8df66646edcb352324cb13767d8c4fda.png.webp"
                alt=""
              />
            </div>
          </div>

          <CardList products={products?.data} handleSeeMore={handleSeeMore} />

          <button className="card__btn-more" onClick={handleSeeMore}>
            {products?.isLoading ? 'Đang tải...' : 'Xem thêm'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
