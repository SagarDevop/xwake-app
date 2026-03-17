import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Video from 'react-native-video';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { followUser } from '../Redux/slices/authSlice';
import { sendFeedback } from '../Redux/slices/feedSlice';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'; // JARVIS: Essential for Reels
import { shallowEqual } from 'react-redux';

const ReelCard = ({ reel, isActive, onPress, containerHeight }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const videoRef = useRef(null);

  // JARVIS: Video Ready State to prevent ghosting (dikhega purana jab tak naya na aaye)
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Reset video ready state if the cell is recycled for a new reel
  useEffect(() => {
    setIsVideoReady(false);
  }, [reel._id]);

  const currentUserId = useSelector(state => state.auth.user?._id);
  const followingList = useSelector(
    state => state.auth.user?.followings || state.auth.user?.following || [],
    shallowEqual,
  );

  const isFollowing = followingList.some(
    item => item === reel.owner._id || item?._id === reel.owner._id,
  );
  const [optimisticFollow, setOptimisticFollow] = useState(false);
  const myReel = reel.owner._id === currentUserId;

  //for checking the render
  // const renderCount = useRef(0);
  // renderCount.current += 1;

  // console.log(
  //   `[RENDER TEST] Reel ID: ${reel._id} rendered ${renderCount.current} times`,
  // );

  const handleFollow = () => {
    setOptimisticFollow(true);
    dispatch(followUser(reel.owner._id));
  };

  const handleVibeUp = () =>
    dispatch(sendFeedback({ postId: reel._id, feedbackType: 'vibeUp' }));
  const handleVibeDown = () =>
    dispatch(sendFeedback({ postId: reel._id, feedbackType: 'vibeDown' }));

  return (
    <Pressable
      onPress={onPress}
      style={{ height: containerHeight, backgroundColor: '#000' }}
    >
      {/* JARVIS: The Magic Shield (Thumbnail Overlay) */}
      {!isVideoReady && (
        <FastImage
          style={{
            height: containerHeight,
            width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 1,
          }}
          source={{
            uri: `${reel.post.url}/ik-thumbnail.jpg`, // Requires your backend to support this extension
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      <Video
        ref={videoRef}
        source={{
          uri: reel.post.url || 'https://www.w3schools.com/html/movie.mp4',
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
        repeat
        paused={!isActive}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        // JARVIS: Hatao shield jab asli video play hone ko ready ho
        onReadyForDisplay={() => setIsVideoReady(true)}
      />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage
              style={styles.avatar}
              source={{
                uri:
                  reel.owner.profilePic.url ||
                  'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=387',
                priority: FastImage.priority.normal,
              }}
            />
            <View
              style={{
                marginLeft: 8,
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}
            >
              <Text style={styles.username}>{reel.owner.username}</Text>

              {!myReel && (!isFollowing || optimisticFollow) && (
                <Pressable
                  onPress={handleFollow}
                  disabled={optimisticFollow}
                  style={[
                    styles.followBtn,
                    {
                      borderColor:
                        optimisticFollow || isFollowing ? '#d0d0d0' : 'white',
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: '600',
                      color:
                        optimisticFollow || isFollowing ? '#d0d0d0' : 'white',
                    }}
                  >
                    {optimisticFollow || isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          <Text
            style={{ marginTop: 5, color: '#ffffff', paddingRight: 50 }}
            numberOfLines={2}
          >
            {reel.caption}
          </Text>
        </View>
      </View>

      {/* Right Buttons */}
      <View style={styles.rightBtn}>
        <Pressable
          onPress={handleVibeUp}
          style={{ flexDirection: 'column', gap: 5, alignItems: 'center' }}
        >
          <Feather
            name="thumbs-up"
            color={reel.isVibedUp ? '#3b82f6' : '#ffffff'}
            size={30}
          />
          <Text style={{ color: reel.isVibedUp ? '#3b82f6' : 'white' }}>
            {reel.vibesUpCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleVibeDown}
          style={{ flexDirection: 'column', gap: 5, alignItems: 'center' }}
        >
          <Feather
            name="thumbs-down"
            color={reel.isVibedDown ? '#ef4444' : '#ffffff'}
            size={30}
          />
          <Text style={{ color: reel.isVibedDown ? '#ef4444' : 'white' }}>
            {reel.vibesDownCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Comments', { postId: reel._id })}
          style={{ flexDirection: 'column', gap: 5, alignItems: 'center' }}
        >
          <MaterialIcons name="comment" color="#ffffff" size={30} />
          <Text style={{ color: 'white' }}>{reel.commentsCount || 0}</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate('ShareScreen', { postValue: reel })
          }
          style={{ flexDirection: 'column', gap: 5, alignItems: 'center' }}
        >
          <Feather name="send" color="#ffffff" size={30} />
          <Text style={{ color: 'white' }}>{reel.sharesCount || 0}</Text>
        </Pressable>

        <Pressable
          style={{ flexDirection: 'column', gap: 5, alignItems: 'center' }}
        >
          <Feather name="bookmark" color="#ffffff" size={30} />
          <Text style={{ color: 'white' }}>{reel.savesCount || 0}</Text>
        </Pressable>

        <Entypo
          style={{ marginTop: 10 }}
          name="dots-three-vertical"
          color="#fff"
          size={20}
        />
      </View>
    </Pressable>
  );
};

// Clean Bouncer for Production
export default React.memo(ReelCard, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.containerHeight === nextProps.containerHeight &&
    prevProps.reel._id === nextProps.reel._id &&
    prevProps.reel.isVibedUp === nextProps.reel.isVibedUp &&
    prevProps.reel.isVibedDown === nextProps.reel.isVibedDown &&
    prevProps.reel.vibesUpCount === nextProps.reel.vibesUpCount &&
    prevProps.reel.vibesDownCount === nextProps.reel.vibesDownCount &&
    prevProps.reel.commentsCount === nextProps.reel.commentsCount
  );
});

// // JARVIS FORENSIC SPY
// export default React.memo(ReelCard, (prevProps, nextProps) => {
//   const isActiveSame = prevProps.isActive === nextProps.isActive;
//   const heightSame = prevProps.containerHeight === nextProps.containerHeight;
//   const idSame = prevProps.reel._id === nextProps.reel._id;
  
//   const vibesUpSame = prevProps.reel.isVibedUp === nextProps.reel.isVibedUp;
//   const vibesDownSame = prevProps.reel.isVibedDown === nextProps.reel.isVibedDown;
//   const vibesUpCountSame = prevProps.reel.vibesUpCount === nextProps.reel.vibesUpCount;
//   const vibesDownCountSame = prevProps.reel.vibesDownCount === nextProps.reel.vibesDownCount;
//   const commentsSame = prevProps.reel.commentsCount === nextProps.reel.commentsCount;

//   const isSame = isActiveSame && heightSame && idSame && vibesUpSame && vibesDownSame && vibesUpCountSame && vibesDownCountSame && commentsSame;

//   // Agar reel ID same hai, par isSame false nikla, toh log karo kiski wajah se fail hua!
//   if (!isSame && idSame) {
//     console.log(`🚨 [MEMO LEAK] Reel ${nextProps.reel._id} re-rendering because:`, {
//       isActiveSame, 
//       heightSame, 
//       vibesUpSame, 
//       vibesDownSame, 
//       vibesUpCountSame, 
//       vibesDownCountSame, 
//       commentsSame
//     });
//   }

//   return isSame;
// });

const styles = StyleSheet.create({
  topHeader: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  avatar: { height: 40, width: 40, borderRadius: 100 },
  username: { fontWeight: '600', fontSize: 15, color: '#fff' },
  followBtn: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rightBtn: {
    flexDirection: 'column',
    width: 60,
    position: 'absolute',
    right: 5,
    bottom: 40,
    alignItems: 'center',
    gap: 20,
    zIndex: 2,
  },
});
