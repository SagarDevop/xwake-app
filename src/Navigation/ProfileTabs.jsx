import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Post from '../Components/Post'
import Reel from '../Components/Reel'
import Saved from '../Components/Saved'

const Tab = createMaterialTopTabNavigator()

const ProfileTabs = ({ data }) => {

 
  const reelData = data?.filter(item => item.type === "reel")

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { backgroundColor: 'black' },
        tabBarStyle: { backgroundColor: 'white' },
      }}
    >
      <Tab.Screen
        name="Post"
        children={() => <Post data={data} />}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="grid-outline"
              size={22}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Reel"
        children={() => <Reel data={reelData} />}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="play-circle-outline"
              size={22}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Saved"
        component={Saved}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="bookmark"
              size={22}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default ProfileTabs