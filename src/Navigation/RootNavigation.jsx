import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigation from './AppNavigation';
import Notification from '../Screens/Notification'
const Stack = createStackNavigator();

const RootNavigation = () => {
  return (
 
      <Stack.Navigator

      >
        <Stack.Screen
        options={{
        headerShown: false
      }}
        name="AppNavigation" component={AppNavigation} />
        <Stack.Screen
         options={{
    title: "Notification",
    headerStyle: {
      backgroundColor: "transparent",
      elevation: 0,      
    }
  }}
        name="Notification" component={Notification} />
      
        
      </Stack.Navigator>
    
  );
};

export default RootNavigation;
