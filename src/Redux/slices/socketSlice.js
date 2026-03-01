import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    connected: false,
    onlineUsers: [],
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    resetSocketState: (state) => {
      state.connected = false;
      state.onlineUsers = [];
    },
  },
});

export const {
  setConnected,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  resetSocketState,
} = socketSlice.actions;

export default socketSlice.reducer;