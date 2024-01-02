import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './axiosClient';

export const findAllProductCart = createAsyncThunk('cart/findAllProductCart', async (_, thunkAPI) => {
  const res = await axiosClient.get('/cart', {
    signal: thunkAPI.signal,
  });

  return res.data;
});

export const findProductByIdCartByUserId = createAsyncThunk(
  'cart/findProductByIdCartByUserId',
  async (userId, thunkAPI) => {
    const res = await axiosClient.get(`/cart?userId=${userId}`, {
      signal: thunkAPI.signal,
    });

    return res.data[0];
  }
);

export const addCart = createAsyncThunk('cart/addCart', async (cart, thunkAPI) => {
  const res = await axiosClient.post('/cart', cart, {
    signal: thunkAPI.signal,
  });

  return res.data;
});

export const updateCart = createAsyncThunk('cart/updateCart', async (cart, thunkAPI) => {
  const res = await axiosClient.put(`/cart/${cart.id}`, cart, {
    signal: thunkAPI.signal,
  });

  return res.data;
});

export const deleteCart = createAsyncThunk('cart/deleteCart', async (cartId, thunkAPI) => {
  await axiosClient.delete(`/cart/${cartId}`, {
    signal: thunkAPI.signal,
  });

  return cartId;
});
