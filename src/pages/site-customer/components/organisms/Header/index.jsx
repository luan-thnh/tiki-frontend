import React, { useEffect, useMemo, useState } from 'react';
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
import { findAllProductByName } from '../../../../../api/productApi';
import { clearCartChangeAccount } from '../../../../../redux/slice/cartSlice';
import { findProductToCart } from '../../../../../api/orderApi';
import { useDebounce } from '../../../../../hooks/useDebounce';

import './styles.scss';
import { addToKeyWord, findAllSuggests } from '../../../../../api/suggestApi';

const historyProducts = JSON.parse(localStorage.getItem('history_search')) || [];

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, userCurrent } = useSelector((state) => state.users);
  const { cart } = useSelector((state) => state.orders);
  const { searchProducts, isLoading } = useSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [suggests, setSuggests] = useState([]);

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

  useEffect(() => {
    if (search.trim()) {
      dispatch(findAllProductByName({ productName: debouncedSearch, limit: 10 }));
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const res = await findAllSuggests();
          setSuggests(res);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    fetchApi();
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleHiddenSearch);

    return () => window.removeEventListener('click', handleHiddenSearch);
  }, [showSearch]);

  const handleOnLogout = () => {
    navigate(SCREEN_URL.LOGIN);
    dispatch(deleteUserCurrent());
    dispatch(clearCartChangeAccount());
  };

  const handleRedirectCart = () => {
    if (!token || !userCurrent) return navigate(SCREEN_URL.LOGIN);
    navigate(SCREEN_URL.CART);
  };

  const handleShowSearch = (e) => {
    e.stopPropagation();
    setShowSearch(true);
  };
  const handleHiddenSearch = () => setShowSearch(false);

  const handleSearchProduct = (e) => setSearch(e.target.value);

  const handleAddHistorySearch = (product) => {
    historyProducts.push(product);
    localStorage.setItem('history_search', JSON.stringify(historyProducts));
  };

  const handleAddToKeyword = async () => {
    if (debouncedSearch.trim()) {
      await addToKeyWord(debouncedSearch);
      navigate(SCREEN_URL.SEARCH + `?q=${debouncedSearch}`);
      historyProducts.push({ keyword: debouncedSearch, type: 'keyword' });
      localStorage.setItem('history_search', JSON.stringify(historyProducts));
    }
  };

  const handleClickRemoveHistorySearch = (e, keyword) => {
    e.stopPropagation();
    const index = historyProducts.findIndex((his) => his.keyword === keyword);

    const historyProductsClone = historyProducts.splice(index, 1);
    localStorage.setItem('history_search', JSON.stringify(historyProductsClone));
  };

  let searchResultComp = '';

  if (isLoading) {
    searchResultComp += <p>Đang tìm kiếm...</p>;
  } else if (historyProducts.length === 0) {
    searchResultComp += <p>Chưa có kết quả tìm kiếm nào!</p>;
  }

  return (
    <>
      <header id="header" className="header">
        <div className="container">
          <div className="header__top">
            <Link to="/" className="header__logo">
              <img src={LogoTiki} alt="Logo" />
            </Link>
            <div className="header__search" onClick={(e) => e.stopPropagation()}>
              <img src={SearchIcon} alt="" className="header__search-icon" />
              <input
                type="text"
                className="header__search-input"
                placeholder="Rẻ mỗi ngày, không chỉ một ngày"
                value={search}
                onChange={handleSearchProduct}
                onFocus={handleShowSearch}
              />
              <button className="header__search-btn" onClick={() => handleAddToKeyword(debouncedSearch)}>
                Tìm kiếm
              </button>

              <div className={`header__search-result ${showSearch ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                {isLoading ? (
                  <p>Đang tìm kiếm...</p>
                ) : (
                  <>
                    {historyProducts.map(({ keyword, type }) => (
                      <Link
                        key={keyword}
                        to={SCREEN_URL.SEARCH + `?q=${keyword}`}
                        className="header__search-history-link"
                      >
                        <img
                          src="https://salt.tikicdn.com/ts/upload/90/fa/09/9deed3e3186254637b5ca648f3032665.png"
                          alt=""
                        />
                        <span className="header__search-history-text">{keyword}</span>
                        <button onClick={(e) => handleClickRemoveHistorySearch(e, keyword)}>
                          <img
                            src="https://salt.tikicdn.com/ts/upload/5c/a1/7e/cd8cde79e81844f2c394efdc415f5441.png"
                            alt=""
                            className="header__search-history-delete"
                          />
                        </button>
                      </Link>
                    ))}
                    {suggests
                      ?.filter(
                        (sug) => historyProducts.map((his) => Object.values(his)[0]).includes(sug.keyword) === false
                      )
                      ?.map(({ id, keyword, type }) => (
                        <Link
                          key={id}
                          to={SCREEN_URL.SEARCH + `?q=${keyword}`}
                          className="header__search-result-link"
                          onClick={() => handleAddHistorySearch({ id, keyword, type })}
                        >
                          <img
                            src="https://salt.tikicdn.com/ts/upload/e8/aa/26/42a11360f906c4e769a0ff144d04bfe1.png"
                            alt=""
                          />
                          <span className="header__search-result-text">{keyword}</span>
                        </Link>
                      ))}
                    {searchProducts?.map(({ productId, productName, urlPath, thumbnailUrl }) => (
                      <Link
                        key={productId}
                        to={SCREEN_URL.DETAILS.replace(':urlPath', urlPath).replace(':productId', productId)}
                        className="header__search-result-link"
                        onClick={() => handleAddHistorySearch({ productId, productName, urlPath })}
                      >
                        <img src={thumbnailUrl} alt="" />
                        <span className="header__search-result-text">{productName}</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
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
      <div className={`overlay ${showSearch ? 'show' : ''}`} onClick={handleHiddenSearch}></div>
    </>
  );
}

export default Header;
