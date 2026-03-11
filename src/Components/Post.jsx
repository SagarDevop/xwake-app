import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Post = ({ data }) => {
  const renderItem = ({ item }) => {
    const isReel = item.type === 'reel';
    const viewCount = item.views;

    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: item.post.url.replace('.mp4', '.jpg'),
          }}
        />
        <View style={styles.reelOverlay}>
          <AntDesign name="eyeo" color="#000" size={18} />
          <Text style={styles.viewCountText}>{viewCount}</Text>
        </View>

        {isReel && (
          <View style={{position: 'absolute', top:2, right:6}}>
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
        data={data}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Post;

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
