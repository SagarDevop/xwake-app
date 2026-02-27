import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/user/me');
      return res.data;
    } catch (error) {
      console.log("FETCH USER ERROR:", error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: true,
    isAuth: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },

    logout: state => {
      state.token = null;
      state.user = null;
      state.isAuth = false;
      state.loading = false;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchUser.rejected, state => {
        state.loading = false;
        state.user = null;
        state.isAuth = false;
        state.token = null;
      });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
