import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addUserCurrent, deleteUserCurrent } from '../../../../../redux/slice/userSlice';
import LogoTiki from '../../../../../assets/images/logo-tiki.png';
import SearchIcon from '../../../../../assets/images/search-icon.png';
import HomeBlueIcon from '../../../../../assets/images/home-blue-icon.png';
import SmileIcon from '../../../../../assets/images/smile-icon.png';
import CartBlueIcon from '../../../../../assets/images/cart-blue-icon.png';
import LocationIcon from '../../../../../assets/images/location-icon.png';
import CategoryIcon from '../../../../../assets/images/category-icon.png';
import ChatIcon from '../../../../../assets/images/chat-icon.png';
import { SCREEN_URL } from '../../../../../constants/screen';
import { findProductByIdCartByUserId } from '../../../../../api/cartApi';
import { clearCartChangeAccount } from '../../../../../redux/slice/cartSlice';

import './styles.scss';
import { findProductToCart } from '../../../../../api/orderApi';

function Header() {
  const { token, userCurrent } = useSelector((state) => state.users);
  const { cart } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnLogout = () => {
    navigate(SCREEN_URL.LOGIN);
    dispatch(deleteUserCurrent());
    dispatch(clearCartChangeAccount());
  };

  const handleRedirectCart = () => {
    if (!token || !userCurrent) return navigate(SCREEN_URL.LOGIN);
    navigate(SCREEN_URL.CART);
  };

  useEffect(() => {
    if (!token || !userCurrent) return;
    dispatch(findProductToCart(userCurrent?.id));
  }, [userCurrent]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userCurrent = JSON.parse(localStorage.getItem('data_user'));

    if (!token || !userCurrent) return;
    dispatch(addUserCurrent({ token, dataUser: userCurrent }));
  }, []);

  console.log(cart);

  return (
    <header id="header" className="header">
      <div className="container">
        <div className="header__top">
          <Link to="/" className="header__logo">
            <img src={LogoTiki} alt="Logo" />
          </Link>
          <div className="header__search">
            <img src={SearchIcon} alt="" className="header__search-icon" />
            <input type="text" className="header__search-input" placeholder="Rẻ mỗi ngày, không chỉ một ngày" />
            <button className="header__search-btn">Tìm kiếm</button>

            <div className="header__search-result"></div>
          </div>
          <div className="header__action">
            <Link to="/" className="header__action-btn header__btn-home active">
              <img src={HomeBlueIcon} alt="" className="header__action-btn-icon" />
              Trang chủ
            </Link>
            <button className={`header__action-btn header__btn-account modal__btn-open ${token ? 'login' : ''}`}>
              <img src={SmileIcon} alt="" className="header__action-btn-icon" />
              <Link to="/login" className="header__btn-login">
                Đăng nhập
              </Link>
              <span className="header__btn-profile">Tài khoản</span>

              <ul className="header__menu-dropdown">
                <li className="header__menu-dropdown-item header__info">
                  <div className="header__info-avatar">
                    <img src={token ? userCurrent?.avatar : ''} alt="" />
                  </div>
                  <p className="header__info-name">{token ? userCurrent?.username : ''}</p>
                </li>
                <li className="header__menu-dropdown-item">
                  <a href="#!" className="header__menu-dropdown-link">
                    Thông tin tài khoản
                  </a>
                </li>
                <li className="header__menu-dropdown-item">
                  <a href="#!" className="header__menu-dropdown-link">
                    Đơn hàng của tôi
                  </a>
                </li>
                <li className="header__menu-dropdown-item">
                  <a href="#!" className="header__menu-dropdown-link header__btn-logout" onClick={handleOnLogout}>
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </button>
            <p className="header__btn-cart active" onClick={handleRedirectCart}>
              <img src={CartBlueIcon} alt="" className="header__action-btn-icon" />
              <span className="header__cart-quantity">
                {cart?.reduce((total, { quantity }) => total + Number(quantity), 0)}
              </span>
            </p>
          </div>
        </div>
        <div className="header__bottom">
          <ul className="header__quick-menu">
            <li className="header__quick-item">
              <a href="#!" className="header__quick-link">
                trái cây
              </a>
            </li>
            <li className="header__quick-item">
              <a href="#!" className="header__quick-link">
                thịt, trứng
              </a>
            </li>
            <li className="header__quick-item">
              <a href="#!" className="header__quick-link">
                rau củ quả
              </a>
            </li>
            <li className="header__quick-item">
              <a href="#!" className="header__quick-link">
                sữa, bơ, phô mai
              </a>
            </li>
            <li className="header__quick-item">
              <a href="#!" className="header__quick-link">
                hải sản
              </a>
            </li>
            <li className="header__quick-item">
              <a href="#!" className="header__quick-link">
                gạo, mì ăn liền
              </a>
            </li>
            <li className="header__quick-item">
              <a href="#!" className="header__quick-link">
                đồ uống, bia rượu
              </a>
            </li>
            <li className="header__quick-item">
              <a href="#!" className="header__quick-link">
                bánh kẹo
              </a>
            </li>
          </ul>

          <div className="header__location">
            <img src={LocationIcon} alt="" className="header__location-icon" />
            <h5 className="header__location-title">Giao đến:</h5>
            <a href="#!" className="header__location-address">
              Q. Hải Châu, P. Hải Châu I, Đà Nẵng
            </a>
          </div>
        </div>
        <div className="header__fixed">
          <Link to="/" className="header__action-btn header__btn-home active">
            <img src={HomeBlueIcon} alt="" className="header__action-btn-icon" />
            Trang chủ
          </Link>
          <button className="header__action-btn header__btn-category">
            <img src={CategoryIcon} alt="" className="header__action-btn-icon" />
            Danh mục
          </button>
          <button className="header__action-btn header__btn-chat">
            <img src={ChatIcon} alt="" className="header__action-btn-icon" />
            Chat
          </button>
          <button className="header__action-btn header__btn-acccount modal__btn-open">
            <img src={SmileIcon} alt="" className="header__action-btn-icon" />
            Tài khoản
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
