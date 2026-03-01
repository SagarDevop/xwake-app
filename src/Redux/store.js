import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import feedReducer from './slices/feedSlice';
import socketReducer from './slices/socketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,  
    socket: socketReducer,
  },
});
