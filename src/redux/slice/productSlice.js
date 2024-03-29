import { createSlice } from '@reduxjs/toolkit';
import {
  findAllProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  findProductById,
  findAllProductByName,
} from '../../api/productApi';

const initialState = {
  data: [],
  pagination: {},
  productDetail: {},
  productCart: [],
  searchProducts: [],
  selectedValue: 'sortByDate|newest',
  isLoading: false,
  isSuccess: false,
  errorMessage: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {
    addSelectedValue(state, { payload }) {
      state.selectedValue = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findProductById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.productDetail = payload;
      })
      .addCase(findProductById.rejected, (state, { payload }) => {
        state.errorMessage = payload;
      })
      .addCase(findAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findAllProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.data = payload.products;
        state.pagination = payload.pagination;
      })
      .addCase(findAllProduct.rejected, (state, { payload }) => {
        state.errorMessage = payload;
      })
      .addCase(findAllProductByName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findAllProductByName.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.searchProducts = payload.products;
      })
      .addCase(findAllProductByName.rejected, (state, { payload }) => {
        state.errorMessage = payload;
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.data.push(payload);
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        const index = state.data.findIndex((user) => user.id === payload.id);
        state.data.splice(index, 1, payload);
        state.user = payload;
        state.selectedItems = [];
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        const index = state.data.findIndex((product) => product.productId === payload);
        if (index !== -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

const { actions, reducer } = productSlice;
export const { addSelectedValue } = actions;
export default reducer;
