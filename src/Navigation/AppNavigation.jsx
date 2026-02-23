import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

import Home from '../Screens/Home';
import Reels from '../Screens/Reels';
import Message from '../Screens/Message';
import Search from '../Screens/Search';
import AuraX from '../Screens/AuraX';
import Profile from '../Screens/Profile';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const AppNavigation = () => {

 

  return (
    <Tab.Navigator
      initialRouteName='Home'
      tabBarPosition="bottom" 
      screenOptions={{
        swipeEnabled: true, 
        animationEnabled: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#6986e9',
        tabBarInactiveTintColor: '#0e3535',
        tabBarIndicatorStyle: { backgroundColor: 'transparent' }, 
        tabBarStyle: { elevation: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="home" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="AuraX"
        component={AuraX}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="ghost" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Reels"
        component={Reels}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-play" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={{ uri:'https://i.pravatar.cc/150?img=3' }}
              style={{
                width: focused ? 28 : 24,
                height: focused ? 28 : 24,
                borderRadius: 50,
                borderWidth: focused ? 2 : 0,
                borderColor: '#6986e9',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
