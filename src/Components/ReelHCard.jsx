import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';



const ReelHCard = ({ reel, isVisible }) => {
  const videoRef = useRef(null);
 
  const { height } = Dimensions.get('window');

  const timeAgo = iso => {
    const seconds = Math.floor((new Date() - new Date(iso)) / 1000);

    if (seconds < 60) return 'Just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <Pressable style={{ flex: 1 }}>
      <Video
        ref={videoRef}
        source={{ uri: reel.post.url }}
        style={{ height: height * 0.75 }}
        resizeMode="cover"
        repeat
        paused={!isVisible}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        controls={false}
        progressUpdateInterval={250}
      />
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={styles.avatar}
            source={{
              uri: reel?.owner?.profilePic?.url
                ? reel.owner.profilePic.url
                : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=387&auto=format&fit=crop',
            }}
          />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.username}>{reel.owner.username}</Text>
            <Text style={styles.time}>{timeAgo(reel.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.rightHeader}>
          <Pressable style={styles.followBtn}>
            <Text style={{ fontWeight: '600' }}>Follow</Text>
          </Pressable>

          <Entypo name="dots-three-vertical" color="#fff" size={18} />
        </View>
      </View>
      <View
        style={{
          height: 40,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
          paddingVertical: 5,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <Feather name="thumbs-up" color="#000" size={24} />
            <Text style={{ paddingTop: 6 }}>Vibe Up</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <Feather
              style={{ paddingTop: 8 }}
              name="thumbs-down"
              color="#000"
              size={24}
            />
            <Text style={{ paddingTop: 6 }}>Vibe Down</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 15, marginTop: 6 }}>
          <MaterialIcons name="comment" color="#000" size={24} />
          <Feather name="send" color="#000" size={24} />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: '15',
          paddingLeft: 9,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          @{reel.owner.username}
        </Text>
        <Text style={{ marginTop: 3, color: '#767777' }}>{reel.caption}</Text>
      </View>
    </Pressable>
  );
};

export default React.memo(ReelHCard);

const styles = StyleSheet.create({
  topHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  avatar: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },

  username: {
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
  },

  time: {
    fontSize: 13,
    color: '#ddd',
  },

  rightHeader: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },

  followBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
