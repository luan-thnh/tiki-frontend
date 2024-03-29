import { createSlice } from '@reduxjs/toolkit';
import {
  findAllOrder,
  createOneOrder,
  findUpdateOrderById,
  findRemoveOrderById,
  findOrderDetailsById,
  findProductToCart,
  findRemoveProductInCart,
  findUpdateOrderDetailsByOrderId,
} from '../../api/orderApi';

const initialState = {
  data: [],
  orderDetail: {},
  cart: [],
  selectedValue: 'sortByDate|newest',
  isLoading: false,
  isSuccess: false,
  errorMessage: '',
};

const orderSlice = createSlice({
  name: 'orders',
  initialState: initialState,
  reducers: {
    addSelectedValue(state, { payload }) {
      state.selectedValue = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findRemoveProductInCart.fulfilled, (state, action) => {
        const index = state.cart.findIndex((c) => c.order === action.meta.arg.orderId);
        if (index !== -1) {
          state.cart.splice(index, 1);
        }
      })
      .addCase(findProductToCart.fulfilled, (state, { payload }) => {
        state.cart = payload?.data;
      })
      .addCase(findOrderDetailsById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findOrderDetailsById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orderDetail = payload?.data;
      })
      .addCase(findOrderDetailsById.rejected, (state, { payload }) => {
        state.errorMessage = payload?.data;
      })
      .addCase(findAllOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findAllOrder.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;

        console.log(payload);

        state.data = payload?.data?.orders;
      })
      .addCase(findAllOrder.rejected, (state, { payload }) => {
        state.errorMessage = payload?.data;
      })
      .addCase(createOneOrder.fulfilled, (state, { payload }) => {
        state.data.push(payload?.data);
        state.cart = [...state.cart, payload?.data];
        console.log({ cart: payload?.data });
      })
      .addCase(findUpdateOrderDetailsByOrderId.fulfilled, (state, { payload }) => {
        const index = state.cart.findIndex((c) => c.order === payload?.data.orderId);
        state.cart.splice(index, 1, Object.assign({}, state.cart[index], payload?.data));
        state.selectedItems = [];
      })
      .addCase(findRemoveOrderById.fulfilled, (state, action) => {
        const index = state.data.findIndex((user) => user.id === action.meta.arg);
        if (index !== -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

const { actions, reducer } = orderSlice;
export const { addSelectedValue } = actions;
export default reducer;
