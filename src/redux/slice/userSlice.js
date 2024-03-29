import { createSlice } from '@reduxjs/toolkit';
import { addUser, deleteUser, findAllUser, findUserById, updateUser } from '../../api/userApi';

const initialState = {
  data: [],
  userCurrent: {},
  userProductsOrder: [],
  selectedValue: 'sortByName|asc',
  token: null,
  isLoading: false,
  isSuccess: false,
  errorMessage: '',
};

const userSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    addUserCurrent(state, { payload }) {
      const { token, dataUser } = payload;

      state.userCurrent = dataUser;
      state.token = token;

      dataUser.role === 'admin'
        ? localStorage.setItem('data_admin', JSON.stringify(dataUser))
        : localStorage.setItem('data_user', JSON.stringify(dataUser));
      localStorage.setItem('token', token);
    },
    deleteUserCurrent(state) {
      state.userCurrent = {};
      state.userCart = {};
      state.token = '';
      localStorage.removeItem('data_user');
      localStorage.removeItem('data_admin');
      localStorage.removeItem('data_cart');
      localStorage.removeItem('token');
    },
    addProductOrder(state, { payload }) {
      state.userProductsOrder = payload;
    },
    addSelectedValue(state, { payload }) {
      state.selectedValue = payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(findAllUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findAllUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;

        const {
          message,
          data: { users },
        } = payload;
        state.data = users;
      })
      .addCase(findAllUser.rejected, (state, { payload }) => {
        state.errorMessage = payload;
      })
      .addCase(addUser.fulfilled, (state, { payload }) => {
        state.data.push(payload?.data);
      })
      .addCase(updateUser.pending, (state, { payload }) => {
        state.isSuccess = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const index = state.data.findIndex((user) => user.uuid === payload?.data.uuid);

        state.data.splice(index, 1, payload?.data);
        state.isSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const index = state.data.findIndex((user) => user.id === action.meta.arg);
        if (index !== -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

const { actions, reducer } = userSlice;
export const { addUserCurrent, deleteUserCurrent, addProductOrder, addSelectedValue } = actions;
export default reducer;
