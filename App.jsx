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
const App = () => {
  return (
    <Provider store={store}>
   <NavigationContainer>
     {/* <PostCard/> */}
      {/* <AppNavigation/> */}
      
      <AuthNavigtion />
    
      {/* <ReelHCard/> */}
     <Toast /> 
   </NavigationContainer>

   </Provider>
  )
}

export default App

const styles = StyleSheet.create({})