import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './axiosClient';

export const findAllProduct = createAsyncThunk('product/getProducts', async (params, thunkAPI) => {
  const res = await axiosClient.get('/products', {
    params,
    signal: thunkAPI.signal,
  });

  return res.data;
});

export const findAllProductByName = createAsyncThunk('product/findAllProductByName', async (params, thunkAPI) => {
  const res = await axiosClient.get('/products', {
    params,
    signal: thunkAPI.signal,
  });

  return res.data;
});

export const findProductById = createAsyncThunk('product/findProductById', async (productId, thunkAPI) => {
  const res = await axiosClient.get(`/products/${productId}`, {
    signal: thunkAPI.signal,
  });

  return res.data;
});

export const addProduct = createAsyncThunk('product/addProduct', async (product, thunkAPI) => {
  const res = await axiosClient.post('/products', product, {
    signal: thunkAPI.signal,
  });

  return res.data;
});

export const updateProduct = createAsyncThunk('product/updateProduct', async (product, thunkAPI) => {
  const res = await axiosClient.put(`/products/${product.id}`, product, {
    signal: thunkAPI.signal,
  });

  return res.data;
});

export const deleteProduct = createAsyncThunk('product/deleteProduct', async (productId, thunkAPI) => {
  const res = await axiosClient.delete(`/products/${productId}`, {
    signal: thunkAPI.signal,
  });

  return res.data;
});
