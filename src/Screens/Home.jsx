import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PostCard from '../Components/PostCard';
import ReelHCard from '../Components/ReelHCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { logout } from '../Redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import CustomToast from '../Components/CustomToast';
import { FlashList } from '@shopify/flash-list';
import HomeLoadPage from '../Loader/HomeLoadPage';
import { fetchFeed, updatePostFromSocket } from '../Redux/slices/feedSlice';
import PostSkeleton from '../Loader/PostSkeleton';
import { useSocket } from '../Redux/Provider/SocketProvider';
import FastImage from 'react-native-fast-image'; // JARVIS: FastImage imported

const story = [
  { id: '1', name: 'sandy' },
  { id: '2', name: 'sany' },
  { id: '3', name: 'sdy' },
];

// JARVIS: Move config OUTSIDE so it is never recreated in memory on re-renders
const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

const Home = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [visibleId, setVisibleId] = useState(null);
  const socket = useSocket();

  const { posts, page, hasMore, initialLoading, paginationLoading } =
    useSelector(state => state.feed);
  const userAvatar = useSelector(state => state.auth.user.profilePic.url);
  const currentUserId = useSelector(state => state.auth.user._id);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      dispatch(logout());
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.log(error);
    }
  };

  // JARVIS: The Magic Callback. Notice the 'extraData' parameter and EMPTY dependency array!
  const renderItem = useCallback(({ item, extraData }) => {
    if (item.type === 'post') {
      return <PostCard post={item} />;
    } else {
      // It only reads visibleId from extraData, preventing function recreation
      return (
        <ReelHCard
          reel={item}
          isVisible={extraData.visibleId === item._id && extraData.isFocused}
        />
      );
    }
  }, []); // <-- EMPTY DEPENDENCIES. Bulletproof.

  // JARVIS: Stable function to handle scroll viewability
  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleId(viewableItems[0].item._id);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleVibeUp = data => dispatch(updatePostFromSocket({ postId: data.postId, vibesUp: data.vibesUp }));
    const handleVibeDown = data => dispatch(updatePostFromSocket({ postId: data.postId, vibesDown: data.vibesDown }));
    const handleCommentUpdate = data => dispatch(updatePostFromSocket({ postId: data.postId, commentsCount: data.comments.length }));

    socket.on('postVibeUpdated', handleVibeUp);
    socket.on('postVibeDownUpdated', handleVibeDown);
    socket.on('postCommentUpdated', handleCommentUpdate);

    return () => {
      socket.off('postVibeUpdated', handleVibeUp);
      socket.off('postVibeDownUpdated', handleVibeDown);
      socket.off('postCommentUpdated', handleCommentUpdate);
    };
  }, [socket, dispatch]);

  if (initialLoading) {
    return <HomeLoadPage />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        // JARVIS: Pass dynamic states here so renderItem doesn't need to re-create
        extraData={{ visibleId, isFocused }}
        // JARVIS: High-Performance Engine optimization. Stops Post views from mixing with Reel views.
        getItemType={item => item.type}
        estimatedItemSize={650}
        onEndReached={() => {
          if (hasMore && !paginationLoading) {
            dispatch(fetchFeed({ page: page + 1, currentUserId }));
          }
        }}
        ListFooterComponent={() =>
          paginationLoading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : null
        }
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <View>
            <View style={styles.headerTop}>
              <Pressable onPress={() => navigation.navigate('Notification')}>
                <MaterialCommunityIcons style={{ paddingBottom: 10 }} name="bell" color="#000" size={25} />
              </Pressable>
              <Text style={{ fontSize: 24 }}>Viby</Text>
              <FontAwesome style={{ paddingTop: 2 }} name="send" color="#000" size={20} />
            </View>
            
            <View style={styles.storySection}>
              <FlatList
                data={story}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                ListHeaderComponentStyle={{ marginRight: 15 }}
                ListHeaderComponent={
                  <View>
                    <View style={styles.myStoryContainer}>
                      <FastImage
                        style={styles.myStoryImage}
                        source={{ uri: userAvatar, priority: FastImage.priority.normal }}
                      />
                    </View>
                    <View style={styles.plusIconContainer}>
                      <AntDesign style={{ margin: 5 }} name="plus" color="#fff" size={15} />
                    </View>
                  </View>
                }
                renderItem={() => <View style={styles.otherStoryContainer} />}
              />
            </View>

            <CustomToast visible={showToast} message="Logged out suiii 🚀" type="success" />
          </View>
        }
      />
      
      <View style={styles.floatingBtn}>
        <Pressable onPress={handleLogout}>
          <AntDesign style={{ marginTop: 10 }} name="plus" color="#000" size={28} />
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14, paddingHorizontal: 14 },
  storySection: { marginTop: 15, paddingTop: 12, marginBottom: 13 },
  myStoryContainer: { marginLeft: 10, height: 90, width: 90, borderRadius: 100, backgroundColor: 'white', justifyContent: 'center' },
  myStoryImage: { height: 85, width: 85, borderRadius: 100, marginLeft: 2.5 },
  plusIconContainer: { position: 'absolute', height: 25, width: 25, borderRadius: 100, backgroundColor: 'black', bottom: 4, left: 78 },
  otherStoryContainer: { height: 90, width: 90, borderRadius: 100, backgroundColor: 'white', marginRight: 15 },
  floatingBtn: { elevation: 6, position: 'absolute', bottom: 58, right: 30, height: 50, width: 50, borderRadius: 100, alignItems: 'center', backgroundColor: '#fff' }
});