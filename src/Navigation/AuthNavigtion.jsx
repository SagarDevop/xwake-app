import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken, logout } from '../Redux/slices/authSlice';
import RootNavigation from './RootNavigation';
import OutterNavigation from './OutterNavigation';
const AuthNavigtion = () => {
  const dispatch = useDispatch();
  const { token, loading } = useSelector(state => state.auth);

  useEffect(() => {
  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem('accessToken');
    console.log("TOKEN FROM STORAGE:", storedToken);

    if (storedToken) {
      dispatch(setToken(storedToken));
    } else {
      dispatch(logout());
    }
  };

  loadToken();
}, []);


  if (loading) return null; 

  return token ? <RootNavigation /> : <OutterNavigation />;
};

export default AuthNavigtion;