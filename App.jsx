import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import Login from './src/Pages/Login'
import OutterNavigation from './src/Navigation/OutterNavigation'
import AppNavigation from './src/Navigation/AppNavigation'
import PostCard from './src/Components/PostCard'
import RootNavigation from './src/Navigation/RootNavigation'
import ReelHCard from './src/Components/ReelHCard'
import { Provider } from 'react-redux'
import { store } from './src/Redux/store'
import AuthNavigtion from './src/Navigation/AuthNavigtion'
import Toast from 'react-native-toast-message';
import SocketProvider from './src/Redux/Provider/SocketProvider'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    
    <Provider store={store}>

   <SocketProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
   <NavigationContainer>
      <AuthNavigtion />
     <Toast /> 
   </NavigationContainer>
   </GestureHandlerRootView>
</SocketProvider>
   </Provider>
 
  )
}

export default App

const styles = StyleSheet.create({})