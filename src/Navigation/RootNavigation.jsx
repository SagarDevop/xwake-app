import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppNavigation from './AppNavigation';
import Notification from '../Screens/Notification';
import CommentsScreen from '../Components/CommentsScreen';
import ShareScreen from '../Components/ShareScreen';
import ThreeDotScreen from '../Components/ThreeDotScreen';
import PostList from '../Screens/PostList';
import FollowNetworkScreen from '../Screens/FollowNetworkScreen';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const user = useSelector(state => state.auth.user);
  console.log('hi dwe', user)
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppNavigation"
        component={AppNavigation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: 'Notification',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="PostList"
        component={PostList}
        options={{
          title: 'Posts',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="FollowNetwork"
        component={FollowNetworkScreen}
        options={{ title: user.username }} 
      />

      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ShareScreen"
        component={ShareScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ThreeDotScreen"
        component={ThreeDotScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
