import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,      
    loading: true,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.loading = false;
    },

    setUser: (state, action) => {   
      state.user = action.payload;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;            
      state.loading = false;
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
