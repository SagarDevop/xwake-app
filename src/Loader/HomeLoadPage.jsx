import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useColorScheme } from 'react-native';

const HomeLoadPage = () => {
    const colorScheme = useColorScheme();

    const isDark = colorScheme === 'dark';
if(isDark){
    return (
        <View style={{backgroundColor:"black", flex:1, alignItems:'center',}}>
            <Image
            style={{height:180, width: 180,position:'absolute', top:200}}
            source={
                require("../../assets/Icons/xletterwhite.png")
            }
            />
            <Text style={{fontSize:20, fontWeight:'500', color:'white', marginTop:10, position:'absolute', bottom:50}}>Xwaked</Text>
        </View>
    )
}
  return (
    <View style={{backgroundColor:"white", flex:1, alignItems:'center',}}>
      <Image
      style={{height:180, width: 180,position:'absolute', top:200}}
      source={
        require("../../assets/Icons/xletterblack.png")
      }
      />
      <Text style={{fontSize:20, fontWeight:'500', color:'black', marginTop:10, position:'absolute', bottom:50}}>Xwaked</Text>
    </View>
    
  )
}

export default HomeLoadPage

const styles = StyleSheet.create({})