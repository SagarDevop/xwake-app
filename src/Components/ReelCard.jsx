import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import Video from 'react-native-video';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { followUser } from '../Redux/slices/authSlice';
import { sendFeedback } from '../Redux/slices/feedSlice';

const ReelCard = ({ reel, isActive, onPress, containerHeight }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  
  const followingList = user?.followings || user?.following || [];
  const isFollowing = followingList.some(
    item => item === reel.owner._id || item?._id === reel.owner._id,
  );
  const [optimisticFollow, setOptimisticFollow] = useState(false);
  const myReel = reel.owner._id === user?._id;

  const handleFollow = () => {
    setOptimisticFollow(true);
    dispatch(followUser(reel.owner._id));
  };

  const handleVibeUp = () => {
    dispatch(sendFeedback({ postId: reel._id, feedbackType: 'vibeUp' }));
  };

  const handleVibeDown = () => {
    dispatch(sendFeedback({ postId: reel._id, feedbackType: 'vibeDown' }));
  };

  return (
    <Pressable onPress={onPress} style={{ height: containerHeight, backgroundColor: '#000' }}>
      
      
      <Video
        source={{ uri: reel.post.url || "https://www.w3schools.com/html/movie.mp4" }}
        style={{ flex: 1 }}
        resizeMode="cover"
        repeat
        paused={!isActive} 
      />
   
      <View style={styles.topHeader}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={styles.avatar}
              source={{
                uri: reel.owner.profilePic.url || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=387',
              }}
            />
            <View style={{ marginLeft: 8, flexDirection: 'row', gap: 15, alignItems: 'center' }}>
              <Text style={styles.username}>{reel.owner.username}</Text>
              
              {!myReel && (!isFollowing || optimisticFollow) && (
                <Pressable 
                  onPress={handleFollow}
                  disabled={optimisticFollow}
                  style={[styles.followBtn, { borderColor: optimisticFollow || isFollowing ? '#d0d0d0' : 'white' }]}
                >
                  <Text style={{ fontWeight: '600', color: optimisticFollow || isFollowing ? '#d0d0d0' : 'white' }}>
                    {optimisticFollow || isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>
              )}

            </View>
          </View>
          <Text style={{ marginTop: 5, color: '#ffffff' }}>
            {reel.caption}
          </Text>
        </View>

        <Entypo
          style={{ marginBottom: 25, marginRight: 15 }}
          name="dots-three-vertical"
          color="#fff"
          size={18}
        />
      </View>

      <View style={styles.rightBtn}>
        
        <Pressable onPress={handleVibeUp} style={{ flexDirection: 'column', gap: 5 }}>
          <Feather 
            name="thumbs-up" 
            color={reel.isVibedUp ? "#3b82f6" : "#ffffff"} 
            size={30} 
          />
          <Text style={{ color: reel.isVibedUp ? "#3b82f6" : 'white', alignSelf:'center' }}>
            {reel.vibesUpCount}
          </Text>
        </Pressable>

        <Pressable onPress={handleVibeDown} style={{ flexDirection: 'column', gap: 5, alignItems: 'center' }}>
          <Feather 
            name="thumbs-down" 
            color={reel.isVibedDown ? "#ef4444" : "#ffffff"} 
            size={30} 
          />
          <Text style={{ color: reel.isVibedDown ? "#ef4444" : 'white' }}>
            {reel.vibesDownCount}
          </Text>
        </Pressable>

        <Pressable style={{ flexDirection: 'column', gap: 5 }}>
          <MaterialIcons name="comment" color="#ffffff" size={30} />
          <Text style={{ color: 'white', alignSelf:'center' }}>{reel.commentsCount}</Text>
        </Pressable>

      
        <Pressable style={{ flexDirection: 'column', gap: 5 }}>
          <Feather name="send" color="#ffffff" size={30} />
          <Text style={{ color: 'white', alignSelf:'center' }}>{reel.sharesCount || 0}</Text>
        </Pressable>

        <Pressable style={{ flexDirection: 'column', gap: 5 }}>
          <Feather name="bookmark" color="#ffffff" size={30} />
          <Text style={{ color: 'white', alignSelf:'center' }}>{reel.savesCount || 0}</Text>
        </Pressable>

      </View>
    </Pressable>
  );
};

// --- THE BOUNCER: Only re-render if something actually changed ---
export default React.memo(ReelCard, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.containerHeight === nextProps.containerHeight &&
    // Check if the actual video changed
    prevProps.reel._id === nextProps.reel._id &&
    // Check if vibes changed (so the colors update when clicked!)
    prevProps.reel.isVibedUp === nextProps.reel.isVibedUp &&
    prevProps.reel.isVibedDown === nextProps.reel.isVibedDown &&
    prevProps.reel.vibesUpCount === nextProps.reel.vibesUpCount &&
    prevProps.reel.vibesDownCount === nextProps.reel.vibesDownCount
  );
});

const styles = StyleSheet.create({
  topHeader: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  username: {
    fontWeight: '600',
    fontSize: 15,
    color: '#fff',
  },
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
    bottom: 90, // Adjusted so it sits nicely above the text
    alignItems: 'center',
    gap: 20,
  },
});