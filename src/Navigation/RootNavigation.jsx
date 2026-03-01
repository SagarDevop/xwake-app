import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppNavigation from './AppNavigation';
import Notification from '../Screens/Notification';
import CommentsScreen from '../Components/CommentsScreen';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
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

      {/* 🔥 Instagram Style Comments */}
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
    </Stack.Navigator>
  );
};

export default RootNavigation;
