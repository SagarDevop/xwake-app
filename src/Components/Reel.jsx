import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DATA = Array.from({ length: 30 }).map((_, i) => ({
  id: i.toString(),
  image: `https://picsum.photos/500/500?random=${i}`
}));

const   Reel = () => {
  return (
    <View>
     <FlatList 
     data={DATA}
     keyExtractor={item => item.id}
     showsVerticalScrollIndicator={false}
     numColumns={3}
     renderItem={({item})=>(
        <Image
     style={{height: 180, width: 118, margin:1}}
     source={{
        uri:'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D'
     }}

     />
     )}
     />
     
    </View>
  )
}

export default Reel

const styles = StyleSheet.create({})