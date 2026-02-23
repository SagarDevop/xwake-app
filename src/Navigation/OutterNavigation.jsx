import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FirstPage from '../Pages/FirstPage';
import Login from '../Pages/Login';
import Register from '../Pages/Register'

const Stack = createStackNavigator();

const OutterNavigation = () => {
  return (
    <Stack.Navigator
    initialRouteName='FirstPage'
    screenOptions={{
        headerShown:false
    }}
    >
      <Stack.Screen name="FirstPage" component={FirstPage} />
      <Stack.Screen name="Login" component={Login} />
       <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

export default OutterNavigation;

const styles = StyleSheet.create({});
