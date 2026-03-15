import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const   Saved = () => {
  const navigation = useNavigation()
  const user = useSelector(state => state.auth.user);


  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const fetchSaved = async () => {
    setLoadingSaved(true);
    try {
      const { data } = await api.get("/api/user/saved");
      console.log("saved post", data)
      setSavedPosts(data);
    } catch (error) {
      
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() =>{
    fetchSaved()
  },[])


  const renderItem = ({ item }) => {
      const isReel = item.type === 'reel';
      const viewCount = item.views;
  
     
      const getImageUrl = () => {
        if (isReel) {
         
          return `${item.post.url}/ik-thumbnail.jpg`; 
        }
       
        return item.post.url;
      };

      return (
        <Pressable  style={styles.imageContainer}  onPress={() => navigation.navigate('SavedItemList', { selectedpost: item,
        AllPosts: savedPosts
       })}>
          <Image
            style={styles.image}
            source={{
              uri: getImageUrl(),
            }}
          />
          <View style={styles.reelOverlay}>
            
            <AntDesign name="eyeo" color="white" size={18} /> 
            <Text style={styles.viewCountText}>{viewCount}</Text>
          </View>
  
          {isReel && (
            <View style={{position: 'absolute', top: 2, right: 6}}>
              <MaterialCommunityIcons
                name="movie-open-play"
                size={18}
                color="white"
                style={styles.reelIcon}
              />
            </View>
          )}
        </Pressable>
      );
    };

  return (
    <View style={styles.container}>
          <FlatList
            data={savedPosts}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            renderItem={renderItem}
          />
        </View>
  )
}

export default Saved

const styles = StyleSheet.create({

    container: {
    flex: 1,
  },
  imageContainer: {
    height: 170,
    width: 118,
    margin: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  reelOverlay: {
    position: 'absolute',
    bottom: 1,
    left: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  reelIcon: {
    
  },
  viewCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
