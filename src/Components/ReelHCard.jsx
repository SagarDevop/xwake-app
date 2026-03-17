import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendFeedback } from '../Redux/slices/feedSlice';
import { useNavigation } from '@react-navigation/native';
import { followUser } from '../Redux/slices/authSlice';
import FastImage from 'react-native-fast-image'; // JARVIS: Upgraded to FastImage\
import { shallowEqual } from 'react-redux';

const ReelHCard = ({ reel, isVisible }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { isVibedUp, isVibedDown, vibesUpCount, vibesDownCount } = reel;

  const handleVibeUp = postId => {
    dispatch(sendFeedback({ postId, feedbackType: 'vibeUp' }));
  };

  const handleVibeDown = postId => {
    dispatch(sendFeedback({ postId, feedbackType: 'vibeDown' }));
  };

  const currentUserId = useSelector(state => state.auth.user?._id);
    const followingList = useSelector(
      state => state.auth.user?.followings || state.auth.user?.following || [],
      shallowEqual,
    );
  const isFollowing = followingList.some(
    item => item === reel.owner._id || item?._id === reel.owner._id,
  );

  const [optimisticFollow, setOptimisticFollow] = useState(false);

  const handleFollow = userId => {
    setOptimisticFollow(true);
    dispatch(followUser(userId));
  };

  const myPost = reel.owner._id === currentUserId;
  const videoRef = useRef(null);
  const { height } = Dimensions.get('window');

  const [isVideoReady, setIsVideoReady] = useState(false);

  // JARVIS: 2. Whenever the FlashList recycles this view for a new Reel, reset the state!
  useEffect(() => {
    setIsVideoReady(false);
  }, [reel._id]);

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

    const renderCount = useRef(0);
    renderCount.current += 1;
  
    console.log(
      `[RENDER TEST] Reel ID: ${reel._id} rendered ${renderCount.current} times`,
    );


  return (
    <Pressable style={{ flex: 1 }}>
      {/* JARVIS: Reel Video Engine. 
          Important: FlashList automatically unmounts this when it goes far off-screen.
          We use `paused={!isVisible}` so it STOPS decoding video when not in immediate view. */}
      {!isVideoReady && (
        <FastImage
          style={{ 
            height: height * 0.75, 
            width: '100%', 
            position: 'absolute', // Video ke upar chipka do
            top: 0, 
            left: 0, 
            zIndex: 1 
          }}
          source={{ 
            uri: `${reel.post.url}/ik-thumbnail.jpg`, // Tera thumbnail format
            priority: FastImage.priority.high 
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      {/* The Video Engine */}
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
        // JARVIS: 4. Jab video sach mein screen pe paint hone ko ready ho tab image hatao
        onReadyForDisplay={() => {
          setIsVideoReady(true);
        }}
      />
      
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row' }}>
          {/* JARVIS: Upgraded Avatar to FastImage */}
          <FastImage
            style={styles.avatar}
            source={{
              uri: reel?.owner?.profilePic?.url || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=387&auto=format&fit=crop',
              priority: FastImage.priority.normal,
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

          <Pressable onPress={() => navigation.navigate('ThreeDotScreen', { postValue: reel })}>
            <Entypo style={{ marginTop: 4 }} name="dots-three-vertical" color="#5a5858" size={18} />
          </Pressable>
        </View>
      </View>

      <View style={styles.actionFooter}>
        <View style={styles.footerIcons}>
          <Pressable onPress={() => handleVibeUp(reel._id)} style={styles.iconRow}>
            <FontAwesome
              name={isVibedUp ? 'thumbs-up' : 'thumbs-o-up'}
              size={21}
              color={isVibedUp ? '#3b82f6' : '#fff'}
              style={{ paddingTop: 3 }}
            />
            <Text style={[styles.iconText, { color: isVibedUp ? '#3b82f6' : '#fff' }]}>Vibe Up</Text>
            <Text style={{ paddingTop: 6, color: isVibedUp ? '#3b82f6' : '#fff' }}>{vibesUpCount || 0}</Text>
          </Pressable>

          <Pressable onPress={() => handleVibeDown(reel._id)} style={styles.iconRow}>
            <FontAwesome
              name={isVibedDown ? 'thumbs-down' : 'thumbs-o-down'}
              size={21}
              style={{ paddingTop: 6 }}
              color={isVibedDown ? '#ef4444' : '#fff'}
            />
            <Text style={[styles.iconText, { color: isVibedDown ? '#ef4444' : '#fff' }]}>Vibe Down</Text>
            <Text style={{ paddingTop: 6, color: isVibedDown ? '#ef4444' : '#fff' }}>{vibesDownCount || 0}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Comments', { postId: reel._id })} style={[styles.iconRow, { marginTop: 5 }]}>
            <MaterialIcons name="comment" color="#fff" size={21} />
            <Text style={{ fontSize: 13, color: '#fff' }}>{reel.commentsCount || 0}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('ShareScreen', { postValue: reel })} style={{ flexDirection: 'row', marginTop: 5 }}>
            <Feather name="send" color="#fff" size={21} />
          </Pressable>

          <Pressable style={{ flexDirection: 'row', marginTop: 5 }}>
            <Feather name="bookmark" color="#fff" size={21} />
          </Pressable>
        </View>
      </View>

      <View style={styles.captionContainer}>
        <Text style={styles.captionUsername}>@{reel.owner.username}</Text>
        <Text style={styles.captionText}>{reel.caption}</Text>
      </View>
    </Pressable>
  );
};

// JARVIS: The Magic Shield. 
// It ONLY re-renders if the Reel's data changes OR if it comes into/out of view (isVisible).
export default React.memo(ReelHCard, (prevProps, nextProps) => {
  return (
    prevProps.reel._id === nextProps.reel._id &&
    prevProps.isVisible === nextProps.isVisible && // MUST check this to play/pause properly
    prevProps.reel.vibesUpCount === nextProps.reel.vibesUpCount &&
    prevProps.reel.vibesDownCount === nextProps.reel.vibesDownCount &&
    prevProps.reel.commentsCount === nextProps.reel.commentsCount &&
    prevProps.reel.isVibedUp === nextProps.reel.isVibedUp &&
    prevProps.reel.isVibedDown === nextProps.reel.isVibedDown
  );
});

const styles = StyleSheet.create({
  topHeader: { position: 'absolute', top: 0, width: '100%', height: 70, flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center' },
  avatar: { height: 50, width: 50, borderRadius: 100 },
  username: { fontWeight: '600', fontSize: 16, color: '#fff' },
  time: { fontSize: 13, color: '#ddd' },
  rightHeader: { flexDirection: 'row', gap: 20, alignItems: 'center' },
  followBtn: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  actionFooter: { height: 40, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 5 },
  footerIcons: { flexDirection: 'row', gap: 22, justifyContent: 'center' },
  iconRow: { flexDirection: 'row', gap: 5 },
  iconText: { paddingTop: 6, fontSize: 13 },
  captionContainer: { flexDirection: 'row', gap: 15, paddingLeft: 9, marginBottom: 20 },
  captionUsername: { fontSize: 16, fontWeight: '600' },
  captionText: { marginTop: 3, color: '#767777' }
});