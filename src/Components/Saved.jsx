import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const   Saved = () => {
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
  
      // Determine the correct image URL based on whether it's a post or a reel
      const getImageUrl = () => {
        if (isReel) {
          // ImageKit way to extract a thumbnail from a video
          return `${item.post.url}/ik-thumbnail.jpg`; 
        }
        // If it's a regular post, just use the normal URL
        return item.post.url;
      };

      return (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: getImageUrl(),
            }}
          />
          <View style={styles.reelOverlay}>
            {/* Note: You might want to change color="#000" to "white" so it matches your text! */}
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
        </View>
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
