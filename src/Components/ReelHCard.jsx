import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { sendFeedback } from '../Redux/slices/feedSlice';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { followUser } from '../Redux/slices/authSlice';

const ReelHCard = ({ reel, isVisible }) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const currentUserId = user?._id;
  const { isVibedUp, isVibedDown, vibesUpCount, vibesDownCount } = reel;

  const handleVibeUp = postId => {
    dispatch(
      sendFeedback({
        postId,
        feedbackType: 'vibeUp',
      }),
    );
  };

  const handleVibeDown = postId => {
    dispatch(
      sendFeedback({
        postId,
        feedbackType: 'vibeDown',
      }),
    );
  };

  //states
  // 1. Reactive Redux check (updates instantly)
  const followingList = user?.followings || user?.following || [];
  const isFollowing = followingList.some(
    item => item === reel.owner._id || item?._id === reel.owner._id,
  );

  // 2. Track if the user tapped the button right now
  const [optimisticFollow, setOptimisticFollow] = useState(false);;

  const handleFollow = userId => {
      setOptimisticFollow(true); 
      dispatch(followUser(userId));
    };

  const myPost = reel.owner._id === currentUserId;

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
        {!myPost && (!isFollowing || optimisticFollow) && (
           <Pressable
            onPress={() => handleFollow(reel.owner._id)}
            style={styles.followBtn}
          >
            <Text style={{ fontWeight: '600', fontSize: 15 }}>
              {isFollowing || optimisticFollow ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
         )}

          <Pressable
            onPress={() =>
              navigation.navigate('ThreeDotScreen', { postValue: reel })
            }
          >
            <Entypo
              style={{ marginTop: 4 }}
              name="dots-three-vertical"
              color="#5a5858"
              size={18}
            />
          </Pressable>
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
        <View
          style={{ flexDirection: 'row', gap: 22, justifyContent: 'center' }}
        >
          <Pressable
            onPress={() => handleVibeUp(reel._id)}
            style={{ flexDirection: 'row', gap: 5 }}
          >
            <FontAwesome
              name={isVibedUp ? 'thumbs-up' : 'thumbs-o-up'}
              size={21}
              color={isVibedUp ? '#3b82f6' : '#000'}
              style={{ paddingTop: 3 }}
            />
            <Text
              style={{
                paddingTop: 6,
                fontSize: 13,
                color: isVibedUp ? '#3b82f6' : '#000',
              }}
            >
              Vibe Up
            </Text>
            <Text
              style={{ paddingTop: 6, color: isVibedUp ? '#3b82f6' : '#000' }}
            >
              {vibesUpCount || 0}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleVibeDown(reel._id)}
            style={{ flexDirection: 'row', gap: 5 }}
          >
            <FontAwesome
              name={isVibedDown ? 'thumbs-down' : 'thumbs-o-down'}
              size={21}
              style={{ paddingTop: 6 }}
              color={isVibedDown ? '#ef4444' : '#000'}
            />
            <Text
              style={{
                paddingTop: 6,
                fontSize: 13,
                color: isVibedDown ? '#ef4444' : '#000',
              }}
            >
              Vibe Down
            </Text>
            <Text
              style={{ paddingTop: 6, color: isVibedDown ? '#ef4444' : '#000' }}
            >
              {vibesDownCount || 0}
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate('Comments', { postId: reel._id })
            }
            style={{ flexDirection: 'row', gap: 5, marginTop: 5 }}
          >
            <MaterialIcons name="comment" color="#000" size={21} />
            <Text style={{ fontSize: 13 }}>{reel.commentsCount || 0}</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate('ShareScreen', { postValue: reel })
            }
            style={{ flexDirection: 'row', marginTop: 5 }}
          >
            <Feather name="send" color="#000" size={21} />
          </Pressable>
          <Pressable style={{ flexDirection: 'row', marginTop: 5 }}>
            <Feather name="bookmark" color="#000" size={21} />
          </Pressable>
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
