import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setConnected,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  resetSocketState,
} from "../slices/socketSlice";

const EndPoint = "https://twikit-backend.onrender.com";

let socketInstance = null;

export const useSocket = () => socketInstance;

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    const connectSocket = async () => {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        console.log("No token found for socket");
        return;
      }

      socketRef.current = io(EndPoint, {
        auth: { token },
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socketInstance = socketRef.current;

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
        dispatch(setConnected(true));
      });

      socketRef.current.on("connect_error", (err) => {
        console.log("Socket connection error:", err.message);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        dispatch(setConnected(false));
      });

      socketRef.current.on("getOnlineUser", (users) => {
        dispatch(setOnlineUsers(users));
      });

      socketRef.current.on("userOnline", (userId) => {
        dispatch(addOnlineUser(userId));
      });

      socketRef.current.on("userOffline", (userId) => {
        dispatch(removeOnlineUser(userId));
      });
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
      socketInstance = null;
      dispatch(resetSocketState());
    };
  }, [user?._id, dispatch]);

  return children;
};

export default SocketProvider;