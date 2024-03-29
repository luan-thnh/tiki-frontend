import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './axiosClient';

export const findAllOrder = createAsyncThunk('order/findAllOrder', async (params, thunkAPI) => {
  const res = await axiosClient.get('/orders', {
    params,
    signal: thunkAPI.signal,
  });

  return res;
});

export const findOrderByUserId = createAsyncThunk('order/findOrderByUserId', async (userId, thunkAPI) => {
  const res = await axiosClient.get(`/orders/${userId}`, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const findOrderDetailsById = createAsyncThunk('order/findOrderDetailsById', async (orderId, thunkAPI) => {
  const res = await axiosClient.get(`/orders/details/${orderId}`, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const findProductOrderByUserId = createAsyncThunk(
  'order/findProductOrderByUserId',
  async ({ userId, productId }, thunkAPI) => {
    const res = await axiosClient.get(`/orders/details/${userId}/${productId}`, {
      signal: thunkAPI.signal,
    });

    return res;
  }
);

export const findProductToCart = createAsyncThunk('order/findProductToCart', async (userId, thunkAPI) => {
  const res = await axiosClient.get(`/orders/cart/${userId}`, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const createOneOrder = createAsyncThunk('order/createOneOrder', async (order, thunkAPI) => {
  const res = await axiosClient.post('/orders', order, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const findUpdateOrderById = createAsyncThunk('order/findUpdateOrderById', async (order, thunkAPI) => {
  const res = await axiosClient.put(`/orders/${order.id}`, order, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const findUpdateOrderDetailsByOrderId = createAsyncThunk(
  'order/findUpdateOrderDetailsByOrderId',
  async (order, thunkAPI) => {
    const res = await axiosClient.put(`/orders/details/${order.orderId}`, order, {
      signal: thunkAPI.signal,
    });

    return res;
  }
);

export const findRemoveProductInCart = createAsyncThunk(
  'order/findRemoveProductInCart',
  async ({ orderId, productId }, thunkAPI) => {
    const res = await axiosClient.delete(`/orders/cart/${orderId}/${productId}`, {
      signal: thunkAPI.signal,
    });

    return res;
  }
);

export const findRemoveOrderById = createAsyncThunk('order/findRemoveOrderById', async (productId, thunkAPI) => {
  const res = await axiosClient.delete(`/orders/${productId}`, {
    signal: thunkAPI.signal,
  });

  return res;
});
