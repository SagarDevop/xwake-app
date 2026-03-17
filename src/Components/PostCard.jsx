import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useState  } from 'react';
import { useRef } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { sendFeedback } from '../Redux/slices/feedSlice';
import { useNavigation } from '@react-navigation/native';
import { followUser } from '../Redux/slices/authSlice';
import FastImage from 'react-native-fast-image'; // JARVIS: Upgraded to FastImage
import { shallowEqual } from 'react-redux';

const PostCard = ({ post }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { isVibedUp, isVibedDown, vibesUpCount, vibesDownCount } = post;

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

 const currentUserId = useSelector(state => state.auth.user?._id);
  const followingList = useSelector(
    state => state.auth.user?.followings || state.auth.user?.following || [],
    shallowEqual,
  );
  const isFollowing = followingList.some(
    item => item === post.owner._id || item?._id === post.owner._id,
  );

  const [optimisticFollow, setOptimisticFollow] = useState(false);

  const handleFollow = userId => {
    setOptimisticFollow(true);
    dispatch(followUser(userId));
  };

  const myPost = post.owner._id === currentUserId;

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
    `[RENDER TEST] Reel ID: ${post._id} rendered ${renderCount.current} times`,
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row' }}>
          {/* JARVIS: Upgraded Avatar to FastImage */}
          <FastImage
            style={styles.avatar}
            source={{
              uri:
                post.owner.profilePic.url ||
                'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=387&auto=format&fit=crop',
              priority: FastImage.priority.normal,
            }}
          />
          <View style={styles.userInfo}>
            <Text style={styles.usernameText}>{post.owner.name}</Text>
            <Text style={styles.timeText}>{timeAgo(post.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.actionHeader}>
          {!myPost && (!isFollowing || optimisticFollow) && (
            <Pressable
              onPress={() => handleFollow(post.owner._id)}
              disabled={optimisticFollow}
              style={[
                styles.followBtn,
                {
                  backgroundColor:
                    isFollowing || optimisticFollow ? '#d0d0d0' : '#e7e7e7',
                },
              ]}
            >
              <Text style={styles.followText}>
                {isFollowing || optimisticFollow ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={() =>
              navigation.navigate('ThreeDotScreen', { postValue: post })
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

      {/* JARVIS: Upgraded Main Post Image to FastImage for caching */}
      <FastImage
        style={styles.postImage}
        source={{
          uri: post.post.url,
          priority: FastImage.priority.high, // High priority for viewport images
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={styles.actionFooter}>
        <View style={styles.footerIcons}>
          <Pressable
            onPress={() => handleVibeUp(post._id)}
            style={styles.iconRow}
          >
            <FontAwesome
              name={isVibedUp ? 'thumbs-up' : 'thumbs-o-up'}
              size={21}
              color={isVibedUp ? '#3b82f6' : '#000'}
              style={{ paddingTop: 3 }}
            />
            <Text
              style={[
                styles.iconText,
                { color: isVibedUp ? '#3b82f6' : '#000' },
              ]}
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
            onPress={() => handleVibeDown(post._id)}
            style={styles.iconRow}
          >
            <FontAwesome
              name={isVibedDown ? 'thumbs-down' : 'thumbs-o-down'}
              size={21}
              color={isVibedDown ? '#ef4444' : '#000'}
              style={{ paddingTop: 6 }}
            />
            <Text
              style={[
                styles.iconText,
                { color: isVibedDown ? '#ef4444' : '#000' },
              ]}
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
              navigation.navigate('Comments', { postId: post._id })
            }
            style={[styles.iconRow, { marginTop: 5 }]}
          >
            <MaterialIcons name="comment" color="#000" size={21} />
            <Text style={{ fontSize: 13 }}>{post.commentsCount || 0}</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate('ShareScreen', { postValue: post })
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

      <View style={styles.captionContainer}>
        <Text style={styles.captionUsername}>{post.owner.username}</Text>
        <Text style={styles.captionText}>{post.caption}</Text>
      </View>
    </View>
  );
};

// JARVIS: The Secret Sauce. Strict checking so the component ONLY re-renders if its OWN data changes.
export default React.memo(PostCard, (prevProps, nextProps) => {
  return (
    prevProps.post._id === nextProps.post._id &&
    prevProps.post.vibesUpCount === nextProps.post.vibesUpCount &&
    prevProps.post.vibesDownCount === nextProps.post.vibesDownCount &&
    prevProps.post.commentsCount === nextProps.post.commentsCount &&
    prevProps.post.isVibedUp === nextProps.post.isVibedUp &&
    prevProps.post.isVibedDown === nextProps.post.isVibedDown
  );
});

// Extracted styles to prevent recreating objects on every render
const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  avatar: { height: 50, width: 50, borderRadius: 100 },
  userInfo: { flexDirection: 'column', gap: 3, marginLeft: 8, paddingTop: 2 },
  usernameText: { fontWeight: '600', fontSize: 16 },
  timeText: { fontSize: 13, color: '#777b7c' },
  actionHeader: { flexDirection: 'row', gap: 20, marginTop: 5 },
  followBtn: {
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  followText: { fontWeight: '600', fontSize: 15 },
  postImage: { height: 500, width: '100%' },
  actionFooter: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  footerIcons: { flexDirection: 'row', gap: 22, justifyContent: 'center' },
  iconRow: { flexDirection: 'row', gap: 5 },
  iconText: { paddingTop: 6, fontSize: 13 },
  captionContainer: {
    flexDirection: 'row',
    gap: 15,
    paddingLeft: 9,
    marginBottom: 20,
  },
  captionUsername: { fontSize: 16, fontWeight: '600' },
  captionText: { marginTop: 3, color: '#767777' },
});
