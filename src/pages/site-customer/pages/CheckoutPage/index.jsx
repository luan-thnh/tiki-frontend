import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { SCREEN_URL } from '../../../../constants/screen';
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from 'react';
import { formatPriceToVnd } from '../../../../utils/formatPrice';
import axios from 'axios';
import moment from 'moment';
import Loading from '../../../../components/Loading';
import PayPalmentButton from '../../components/atoms/PayPalmentButton';
import checkIcon from '../../../../assets/images/check.png';

import './style.scss';
import axiosClient from '../../../../api/axiosClient';

function CheckoutPage(props) {
  const dispatch = useDispatch();
  const { userCurrent, userProductsOrder, isLoading } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [infoOrder, setInfoOrder] = useState({
    uuid: userCurrent?.id,
    fullName: userCurrent?.fullName || '',
    phoneNumber: userCurrent?.phoneNumber || '',
    province: userCurrent?.province || '',
    district: userCurrent?.district || '',
    ward: userProductsOrder?.ward || '',
    address: userCurrent?.address || '',
    typeAddress: 'Nhà riêng',
  });
  const [address, setAddress] = useState({
    provinces: [],
    districts: [],
    wards: [],
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await axios.get('https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100');
      setAddress({ ...address, provinces: res.data.results });
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!userProductsOrder.length) return navigate(SCREEN_URL.CART);
  }, [userProductsOrder]);

  const handleFetchGetDistricts = async (e) => {
    const value = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    const res = await axios(
      `https://vnprovinces.pythonanywhere.com/api/districts/?province_id=${value}&basic=true&limit=100`
    );
    setAddress({ ...address, districts: res.data.results });
    setInfoOrder({ ...infoOrder, province: name });
  };

  const handleFetchGetWards = async (e) => {
    const value = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    const res = await axios(
      `https://vnprovinces.pythonanywhere.com/api/wards/?district_id=${value}&basic=true&limit=100`
    );
    setAddress({ ...address, wards: res.data.results });
    setInfoOrder({ ...infoOrder, district: name });
  };

  const handleChangeWard = (e) => {
    const name = e.target.options[e.target.selectedIndex].text;
    setInfoOrder({ ...infoOrder, ward: name });
  };

  const handleChangeInput = (e) => {
    const { value, name } = e.target;

    setInfoOrder({
      ...infoOrder,
      [name]: value,
    });
  };

  const totalPrice = useMemo(
    () => userProductsOrder.reduce((total, { totalPrice }) => total + totalPrice, 0),
    [userProductsOrder]
  );

  const handleAddInfo = async () => {
    try {
      setShowInfo(true);
      const res = await axios.put(`http://localhost:3003/api/v1/users/${userCurrent.id}`, { ...user, ...infoOrder });

      setUser({ ...res.data.data });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    const order = {
      id: uuidv4(),
      products: userProductsOrder,
      infoOrder: infoOrder,
      total: totalPrice,
      createdAt: moment().format(),
      updatedAt: moment().format(),
    };

    console.log(infoOrder);
    console.log(userProductsOrder);

    //  await axiosClient.put(`/orders/:orderId/status`)

    // dispatch(findProductToCart)
    setIsCheckoutSuccess(true);
  };

  const handleChoosePay = (e) => {
    const value = e.target.value;

    if (value === 'paypal-money') setShowPaypal(true);
    else setShowPaypal(false);
  };

  return (
    <div className="container checkout">
      <div className="checkout__left">
        {isCheckoutSuccess && (
          <div className="alert-success">
            <img src={checkIcon} alt="" />
            <p>Đơn hàng đặt hàng thành công</p>
          </div>
        )}
        <div className="checkout__form checkout--bg-white">
          <h2 className="checkout__form--heading">Địa chỉ giao hàng</h2>
          <div className="checkout__form-container">
            <div className="checkout__form-group">
              <label htmlFor="" className="checkout__form-label">
                Họ và tên
              </label>
              <input type="text" name="fullName" value={infoOrder.fullName} onChange={handleChangeInput} />
            </div>
            <div className="checkout__form-group">
              <label htmlFor="" className="checkout__form-label">
                Điện thoại di động
              </label>
              <input type="text" name="phoneNumber" value={infoOrder.phoneNumber} onChange={handleChangeInput} />
            </div>
            <div className="checkout__form-group">
              <label htmlFor="" className="checkout__form-label">
                Tỉnh/Thành phố
              </label>
              <select name="province" id="" onChange={handleFetchGetDistricts}>
                <option value="" disabled selected={!infoOrder.province} hidden>
                  Chọn Tỉnh/Thành phố
                </option>
                {address.provinces.map(({ id, full_name }) => (
                  <option key={id} value={id} selected={infoOrder.province.toLowerCase() === full_name.toLowerCase()}>
                    {full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="checkout__form-group">
              <label htmlFor="" className="checkout__form-label">
                Quận/Huyện
              </label>
              <select name="district" id="" onChange={handleFetchGetWards}>
                <option value="" disabled selected={!infoOrder.district} hidden>
                  Chọn Quận/Huyện
                </option>
                {address.districts.map(({ id, full_name }) => (
                  <option key={id} value={id} selected={infoOrder.district.toLowerCase() === full_name.toLowerCase()}>
                    {full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="checkout__form-group">
              <label htmlFor="" className="checkout__form-label">
                Phường/Xã
              </label>
              <select name="ward" id="" onChange={handleChangeWard}>
                <option value="" disabled selected={!infoOrder.ward} hidden>
                  Chọn Phường/Xã
                </option>
                {address.wards.map(({ id, full_name }) => (
                  <option key={id} value={id} selected={infoOrder.ward.toLowerCase() === full_name.toLowerCase()}>
                    {full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="checkout__form-group">
              <label htmlFor="" className="checkout__form-label">
                Địa chỉ
              </label>
              <input type="text" name="address" value={infoOrder.address} onChange={handleChangeInput} />
            </div>
            <div className="checkout__form-group">
              <label htmlFor="" className="checkout__form-label">
                Loại địa chỉ
              </label>
              <div className="checkout__form-radio-group">
                <div className="checkout__form-radio">
                  <input
                    type="radio"
                    id="house"
                    name="typeAddress"
                    value="Nhà riêng"
                    onChange={handleChangeInput}
                    defaultChecked
                  />
                  <label htmlFor="house">Nhà riêng / Chung cư</label>
                </div>
                <div className="checkout__form-radio">
                  <input type="radio" name="typeAddress" id="company" value="Công ty" onChange={handleChangeInput} />
                  <label htmlFor="company">Cơ quan / Công ty</label>
                </div>
              </div>
            </div>
          </div>
          <button className="checkout__form-submit" onClick={handleAddInfo}>
            Lưu
          </button>
        </div>
        <div className="checkout__pay checkout--bg-white">
          <h2 className="checkout__pay--heading">Chọn hình thức thanh toán</h2>
          <div className="checkout__pay-group">
            <input
              type="radio"
              name="pay-radio"
              id="cash-on-delivery"
              value="cash-on-delivery"
              defaultChecked
              onChange={handleChoosePay}
            />
            <label htmlFor="cash-on-delivery">
              <img src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png" alt="" />
              <span>Thanh toán tiền mặt khi nhận hàng</span>
            </label>
          </div>

          <div className="checkout__pay-group">
            <input type="radio" name="pay-radio" id="paypal-money" value="paypal-money" onChange={handleChoosePay} />
            <label htmlFor="paypal-money">
              <img src="https://www.pngall.com/wp-content/uploads/5/PayPal-Logo-PNG-Free-Image.png" alt="" />
              <span>Thanh toán bằng ví Paypal</span>
            </label>
          </div>

          {/* <div className="checkout__pay-group">
            <input type="radio" name="pay-radio" id="viettel-money" value="viettel-money" />
            <label htmlFor="viettel-money">
              <img src="https://salt.tikicdn.com/ts/upload/5f/f9/75/d7ac8660aae903818dd7da8e4772e145.png" alt="" />
              <span>Thanh toán bằng ví Viettel Money</span>
            </label>
          </div>

          <div className="checkout__pay-group">
            <input type="radio" name="pay-radio" id="momo-wallet" value="momo-wallet" />
            <label htmlFor="momo-wallet">
              <img src="https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg" alt="" />
              <span>Thanh toán bằng ví MoMo</span>
            </label>
          </div>

          <div className="checkout__pay-group">
            <input type="radio" name="pay-radio" id="zalopay-wallet" value="zalopay-wallet" />
            <label htmlFor="zalopay-wallet">
              <img src="https://salt.tikicdn.com/ts/upload/2f/43/da/dd7ded6d3659036f15f95fe81ac76d93.png" alt="" />
              <span>Thanh toán bằng ví ZaloPay</span>
            </label>
          </div> */}
        </div>
      </div>
      <div className="checkout__right">
        {showInfo && (
          <div className="checkout__address checkout--bg-white">
            <p className="checkout__address--title">Giao tới</p>
            <h4>
              {user.fullName} | {user.phoneNumber}
            </h4>
            <div className="checkout__address--text">
              <span className="tag">{user.typeAddress}</span>
              <p>
                {user.address}, {user.ward}, {user.district}, {infoOrder.province}
              </p>
            </div>
          </div>
        )}
        <div className="checkout__order checkout--bg-white">
          <div className="checkout__order-header">
            <div className="checkout__order-title">
              <h4 className="checkout__order--heading">Đơn hàng</h4>
              <Link to={SCREEN_URL.CART}>Thay đổi</Link>
            </div>
          </div>
          <div className="checkout__order-body">
            <div className="checkout__order-price">
              <div className="checkout__order-price-top">
                <p className="checkout__order-price--label">Tạm tính</p>
                <p className="checkout__order-price-price">{formatPriceToVnd(totalPrice)}</p>
              </div>
              <div className="checkout__order-price-body">
                <p className="checkout__order-price--label">Tổng tiền</p>
                <p className="checkout__order-price--final">{formatPriceToVnd(totalPrice)}</p>
              </div>
            </div>
            {showPaypal ? (
              <PayPalmentButton cart={userProductsOrder} />
            ) : (
              <button className="checkout__order-price-btn" onClick={handleCheckout}>
                Đặt hàng
              </button>
            )}
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}

export default CheckoutPage;
