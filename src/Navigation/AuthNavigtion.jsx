import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken, logout } from '../Redux/slices/authSlice';
import RootNavigation from './RootNavigation';
import OutterNavigation from './OutterNavigation';
import { fetchUser } from '../Redux/slices/authSlice';
import { fetchFeed } from '../Redux/slices/feedSlice';
import { View, Text } from 'react-native';
import HomeLoadPage from '../Loader/HomeLoadPage';


const AuthNavigtion = () => {
  const dispatch = useDispatch();

  const { isAuth, loading: authLoading } = useSelector(
    state => state.auth
  );

 const { initialLoading } = useSelector(state => state.feed);

 
  console.log("AUTH LOADING:", authLoading);
  console.log("FEED LOADING:", initialLoading);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('accessToken');

      if (storedToken) {
        dispatch(setToken(storedToken));

        const userResult = await dispatch(fetchUser());

        if (userResult.meta.requestStatus === 'fulfilled') {
          await dispatch(fetchFeed(1));
        }
      } else {
        dispatch(logout());
      }
    };

    loadToken();
  }, []);

  if (authLoading || initialLoading) {
    return (
      <HomeLoadPage/>
    );
  }

  return isAuth ?    <RootNavigation/> : <OutterNavigation />;
};

export default AuthNavigtion;