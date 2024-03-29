import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatPriceToVnd } from '../../../../utils/formatPrice';
import { addProductOrder } from '../../../../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { SCREEN_URL } from '../../../../constants/screen';
import { findRemoveProductInCart, findUpdateOrderDetailsByOrderId } from '../../../../api/orderApi';
import ModalRemove from '../../components/molecules/ModalRemove';
import ModalWarning from '../../components/molecules/ModalWarning';

import './style.scss';

function CartPage(props) {
  const { data } = useSelector((state) => state.cart);
  const { cart } = useSelector((state) => state.orders);
  const { userCurrent } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openRemove, setOpenRemove] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleOpenRemove = () => setOpenRemove(true);
  const handleCloseRemove = () => setOpenRemove(false);
  const handleOpenWarning = () => setOpenWarning(true);
  const handleCloseWarning = () => setOpenWarning(false);
  const handleClearSelected = () => {
    setSelectAll(false);
    setSelectedItems([]);
  };

  const handleClickRemove = () => {
    if (!selectedItems.length) return handleOpenWarning();
    handleOpenRemove();
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const allProductIds = cart?.map(({ productId }) => productId);

    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allProductIds);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectAll(false);
    const index = selectedItems.indexOf(itemId);
    if (index === -1) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  const handleRemoveOrder = () => {
    selectedItems.forEach((productId) => {
      const orderRemove = cart.find((c) => c.productId === productId);
      dispatch(findRemoveProductInCart({ orderId: orderRemove?.order, productId }));
    });

    handleCloseRemove();
    handleClearSelected();
  };

  const handleIncrementQuantity = async (productId) => {
    const newProducts = [...cart];
    const index = newProducts.findIndex(({ productId: id }) => id === productId);
    const updatedProduct = { ...newProducts[index] };

    updatedProduct.quantity += 1;
    if (updatedProduct.quantity >= newProducts[index].limitProduct) updatedProduct.quantity = 1;

    newProducts[index] = updatedProduct;

    const newCart = {
      ...updatedProduct,
      orderId: updatedProduct?.order,
      totalPrice: updatedProduct?.quantity * updatedProduct?.unitPrice,
      userId: userCurrent?.id,
    };

    await dispatch(findUpdateOrderDetailsByOrderId(newCart));
  };

  const handleDecrementQuantity = async (productId) => {
    const newProducts = [...cart];
    const index = newProducts.findIndex(({ productId: id }) => id === productId);
    const updatedProduct = { ...newProducts[index] };

    updatedProduct.quantity -= 1;
    if (updatedProduct.quantity >= newProducts[index].limitProduct || updatedProduct.quantity <= 0) {
      updatedProduct.quantity = 1;
      handleSelectItem(productId);
      handleOpenRemove();
    }

    newProducts[index] = updatedProduct;

    const newCart = {
      ...updatedProduct,
      orderId: updatedProduct?.order,
      totalPrice: updatedProduct?.quantity * updatedProduct?.unitPrice,
      userId: userCurrent?.id,
    };

    await dispatch(findUpdateOrderDetailsByOrderId(newCart));
  };

  const handleChangeQuantity = async (e, productId) => {
    const value = e.target.value;
    const newProducts = [...cart];
    const index = newProducts.findIndex(({ productId: id }) => id === productId);
    const updatedProduct = { ...newProducts[index] };

    updatedProduct.quantity = value;
    if (updatedProduct.quantity <= 0) updatedProduct.quantity = 1;

    newProducts[index] = updatedProduct;

    const newCart = {
      ...updatedProduct,
      orderId: updatedProduct?.order,
      totalPrice: updatedProduct?.quantity * updatedProduct?.unitPrice,
      userId: userCurrent?.id,
    };

    await dispatch(findUpdateOrderDetailsByOrderId(newCart));
    // dispatch(updateCart({ ...data, products: newProducts }));
  };

  const totalPriceAll = useMemo(
    () =>
      cart
        ?.filter(({ productId }) => selectedItems.includes(productId))
        .reduce((total, { totalPrice }) => total + totalPrice, 0),
    [data, selectedItems]
  );

  const handleCheckout = async () => {
    if (!selectedItems.length) return handleOpenWarning();

    const productsCheckout = cart?.filter(({ productId }) => selectedItems.includes(productId));

    console.log({ productsCheckout });

    dispatch(addProductOrder(productsCheckout));
    navigate(SCREEN_URL.CHECKOUT);
  };

  return (
    <>
      <main id="main" className="main">
        <div className="cart container">
          <h3 className="cart--heading">GIỎ HÀNG</h3>
          <div className="cart__container">
            <div className="cart__table">
              <div className="cart__table-head">
                <div className="cart__table-row">
                  <div className="cart__table-col">
                    <input
                      type="checkbox"
                      id="table-checkbox-1"
                      className="cart__table-checkbox cart__checkbox-all"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="table-checkbox-1" className="cart__table-label cart__select-all-product">
                      Tất cả ({cart.length} sản phẩm)
                    </label>
                  </div>
                  <div className="cart__table-col" style={{ margin: '0 15px' }}>
                    <span className="cart__table-label">Đơn giá</span>
                  </div>
                  <div className="cart__table-col">
                    <span className="cart__table-label">Số lượng</span>
                  </div>
                  <div className="cart__table-col">
                    <span className="cart__table-label">Thành tiền</span>
                  </div>
                  <div className="cart__table-col">
                    <button
                      className="cart__table-btn-remove cart__table-btn-remove-all"
                      title="Xoá mục đã chọn"
                      onClick={handleClickRemove}
                    >
                      <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg" alt="" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="cart__table-body">
                {cart?.map(
                  ({ id, productId, productName, thumbnailUrl, unitPrice, totalPrice, quantity, shopName }, index) => (
                    <div key={productId} className="cart__table-group">
                      <div className="cart__table-row">
                        <div className="cart__table-col">
                          <label htmlFor="table-checkbox-${id + 99}" className="cart__table-label">
                            <img
                              src="https://salt.tikicdn.com/ts/upload/30/24/79/8317b36e87e7c0920e33de0ab5c21b62.png"
                              alt="Icon home"
                              className="cart__table-icon-home"
                            />
                            <span className="cart__table-seller">{shopName}</span>
                          </label>
                        </div>
                      </div>
                      <div className="cart__table-row">
                        <div className="cart__table-col">
                          <input
                            type="checkbox"
                            id="table-checkbox-${id + 99}"
                            className="cart__table-checkbox cart__checkbox-item"
                            checked={selectedItems.includes(productId)}
                            onChange={() => handleSelectItem(productId)}
                          />
                          <a href="/details" className="cart__table-product">
                            <img src={thumbnailUrl} alt={productName} className="cart__table-product-image" />
                            <span className="cart__table-product-name">{productName}</span>
                          </a>
                        </div>
                        <div className="cart__table-col cart__table-price">
                          {<span className="price-current">{formatPriceToVnd(unitPrice)}</span>}
                        </div>
                        <div className="cart__table-col cart__table-quantity">
                          <button
                            className="cart__table-quantity-btn cart__table-quantity-btn-minus"
                            onClick={() => handleDecrementQuantity(productId)}
                          >
                            <img
                              src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/decrease.svg"
                              alt=""
                            />
                          </button>
                          <input
                            type="number"
                            className="cart__table-quantity-input"
                            value={quantity}
                            onChange={(e) => handleChangeQuantity(e, productId)}
                          />
                          <button
                            className="cart__table-quantity-btn cart__table-quantity-btn-plus"
                            onClick={() => handleIncrementQuantity(productId)}
                          >
                            <img
                              src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/increase.svg"
                              alt=""
                            />
                          </button>
                        </div>
                        <div className="cart__table-col cart__table-money">
                          <span>{formatPriceToVnd(totalPrice)}</span>
                        </div>
                        <div className="cart__table-col">
                          <button
                            className="cart__table-btn-remove cart__table-btn-remove-one"
                            onClick={handleClickRemove}
                          >
                            <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg" alt="" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="cart__checkout">
              <div className="cart__checkout-coupon">
                <div className="cart__checkout-coupon-header">
                  <h4 className="cart__checkout-coupon--title">Tiki Khuyến Mãi</h4>
                  <span
                    className="cart__checkout-coupon--info"
                    title="Áp dụng tối đa 1 Mã giảm giá Sản Phẩm và 1 Mã Vận Chuyển"
                  >
                    Có thể chọn 2
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="info-icon"
                      background="#ffffff"
                    >
                      <path
                        d="M12.75 11.25C12.75 10.8358 12.4142 10.5 12 10.5C11.5858 10.5 11.25 10.8358 11.25 11.25V15.75C11.25 16.1642 11.5858 16.5 12 16.5C12.4142 16.5 12.75 16.1642 12.75 15.75V11.25Z"
                        fill="#787878"
                      ></path>
                      <path
                        d="M12.75 8.25C12.75 8.66421 12.4142 9 12 9C11.5858 9 11.25 8.66421 11.25 8.25C11.25 7.83579 11.5858 7.5 12 7.5C12.4142 7.5 12.75 7.83579 12.75 8.25Z"
                        fill="#787878"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12Z"
                        fill="#787878"
                      ></path>
                    </svg>
                  </span>
                </div>
                <div className="cart__checkout-coupon-choice">
                  <svg
                    className="coupon-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.2803 14.7803L14.7803 10.2803C15.0732 9.98744 15.0732 9.51256 14.7803 9.21967C14.4874 8.92678 14.0126 8.92678 13.7197 9.21967L9.21967 13.7197C8.92678 14.0126 8.92678 14.4874 9.21967 14.7803C9.51256 15.0732 9.98744 15.0732 10.2803 14.7803Z"
                      fill="#0B74E5"
                    ></path>
                    <path
                      d="M10.125 10.5C10.7463 10.5 11.25 9.99632 11.25 9.375C11.25 8.75368 10.7463 8.25 10.125 8.25C9.50368 8.25 9 8.75368 9 9.375C9 9.99632 9.50368 10.5 10.125 10.5Z"
                      fill="#0B74E5"
                    ></path>
                    <path
                      d="M15 14.625C15 15.2463 14.4963 15.75 13.875 15.75C13.2537 15.75 12.75 15.2463 12.75 14.625C12.75 14.0037 13.2537 13.5 13.875 13.5C14.4963 13.5 15 14.0037 15 14.625Z"
                      fill="#0B74E5"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.75 5.25C3.33579 5.25 3 5.58579 3 6V9.75C3 10.1642 3.33579 10.5 3.75 10.5C4.61079 10.5 5.25 11.1392 5.25 12C5.25 12.8608 4.61079 13.5 3.75 13.5C3.33579 13.5 3 13.8358 3 14.25V18C3 18.4142 3.33579 18.75 3.75 18.75H20.25C20.6642 18.75 21 18.4142 21 18V14.25C21 13.8358 20.6642 13.5 20.25 13.5C19.3892 13.5 18.75 12.8608 18.75 12C18.75 11.1392 19.3892 10.5 20.25 10.5C20.6642 10.5 21 10.1642 21 9.75V6C21 5.58579 20.6642 5.25 20.25 5.25H3.75ZM4.5 9.08983V6.75H19.5V9.08983C18.1882 9.41265 17.25 10.5709 17.25 12C17.25 13.4291 18.1882 14.5874 19.5 14.9102V17.25H4.5V14.9102C5.81181 14.5874 6.75 13.4291 6.75 12C6.75 10.5709 5.81181 9.41265 4.5 9.08983Z"
                      fill="#0B74E5"
                    ></path>
                  </svg>
                  <span>Chọn hoặc nhập Khuyến mãi khác</span>
                </div>
              </div>
              <div className="cart__checkout-body">
                <div className="cart__checkout-price">
                  <div className="cart__checkout-price-top">
                    <p className="cart__checkout-price--label">Tạm tính</p>
                    <p className="cart__checkout-price-price">{formatPriceToVnd(totalPriceAll)}</p>
                  </div>
                  <div className="cart__checkout-price-body">
                    <p className="cart__checkout-price--label">Tổng tiền</p>
                    <p className="cart__checkout-price--final">
                      {totalPriceAll === 0 ? (
                        <span style={{ fontSize: 14 }}>Vui lòng chọn sản phẩm</span>
                      ) : (
                        formatPriceToVnd(totalPriceAll)
                      )}
                    </p>
                  </div>
                </div>
                <button className="cart__checkout-price-btn" onClick={handleCheckout}>
                  Mua Hàng ({selectedItems.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ModalRemove open={openRemove} handleRemove={handleRemoveOrder} handleClose={handleCloseRemove} />
      <ModalWarning open={openWarning} content="Bạn chưa chọn sản phẩm nào" handleClose={handleCloseWarning} />
    </>
  );
}

export default CartPage;
