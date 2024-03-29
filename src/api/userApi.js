import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './axiosClient';

export const login = createAsyncThunk('user/login', async ({ email, password }, thunkAPI) => {
  const res = await axiosClient.post(
    `/users/login`,
    { email, password },
    {
      signal: thunkAPI.signal,
    }
  );

  return res;
});

export const register = createAsyncThunk('user/register', async (user, thunkAPI) => {
  const res = await axiosClient.post(`/users/register`, user, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const findAllUser = createAsyncThunk('user/findAllUser', async (params, thunkAPI) => {
  try {
    const res = await axiosClient.get('/users', {
      params,
      signal: thunkAPI.signal,
    });

    return res;
  } catch (error) {
    console.error('Error in findAllUser thunk:', error);
    throw error; // Rethrow the error to be handled by the calling code
  }
});

export const findUserById = createAsyncThunk('user/findUserById', async (userId, thunkAPI) => {
  const res = await axiosClient.get(`/users/${userId}`, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const findUserByOne = createAsyncThunk('user/findUserByOne', async (params, thunkAPI) => {
  const res = await axiosClient.get(`/users/user`, {
    params,
    signal: thunkAPI.signal,
  });

  return res;
});

export const findImageToUploadAvatar = createAsyncThunk('user/findImageToUploadAvatar', async (formData, thunkAPI) => {
  const res = await axiosClient.post(`/users/upload-avatar/${formData.get('userId')}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    signal: thunkAPI.signal,
  });

  return res;
});

export const addUser = createAsyncThunk('user/addUser', async (user, thunkAPI) => {
  const res = await axiosClient.post(`/users`, user, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const updateUser = createAsyncThunk('user/updateUser', async (user, thunkAPI) => {
  const res = await axiosClient.put(`/users/${user.uuid}`, user, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (userId, thunkAPI) => {
  const res = await axiosClient.delete(`/users/${userId}`, {
    signal: thunkAPI.signal,
  });

  return res;
});

export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email, thunkAPI) => {
  const res = await axiosClient.post(
    `/users/forgot-password`,
    { email },
    {
      signal: thunkAPI.signal,
    }
  );

  return res;
});

export const redirectResetPassword = createAsyncThunk(
  'user/redirectResetPassword',
  async ({ userId, token }, thunkAPI) => {
    const res = await axiosClient.get(`/users/reset-password/${userId}/${token}`, {
      signal: thunkAPI.signal,
    });

    return res;
  }
);

export const updatedResetPassword = createAsyncThunk(
  'user/updatedResetPassword',
  async ({ userId, token, password }, thunkAPI) => {
    const res = await axiosClient.post(
      `/users/reset-password/${userId}/${token}`,
      { password },
      {
        signal: thunkAPI.signal,
      }
    );

    return res;
  }
);
