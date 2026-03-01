import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PostCard from '../Components/PostCard';
import ReelHCard from '../Components/ReelHCard';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../Redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import api from '../api';
import { useState } from 'react';
import CustomToast from '../Components/CustomToast';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import HomeLoadPage from '../Loader/HomeLoadPage';
import { fetchFeed } from '../Redux/slices/feedSlice';
import PostSkeleton from '../Loader/PostSkeleton';
import { updatePostFromSocket } from "../Redux/slices/feedSlice";
import { useSocket } from "../Redux/Provider/SocketProvider";


const story = [
  {
    id: '1',
    name: 'sandy',
  },
  {
    id: '2',
    name: 'sany',
  },
  {
    id: '3',
    name: 'sdy',
  },
];

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [visibleId, setVisibleId] = useState(null);
  const socket = useSocket();


  const { posts, page, hasMore, initialLoading, paginationLoading } =
    useSelector(state => state.feed);
  const userAvatar = useSelector(state => state.auth.user.profilePic.url);
  
const currentUserId = useSelector(state => state.auth.user._id);

  const viewabilityRef = useRef();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      dispatch(logout());
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  // render on time

  const renderItem = useCallback(
    ({ item }) => {
      if (item.type === 'post') {
        return <PostCard post={item}  />;
      } else {
        return <ReelHCard reel={item} isVisible={visibleId === item._id} />;
      }
    },
    [visibleId],
  );

  //
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleId(viewableItems[0].item._id);
    }
  });

  useEffect(() => {
    if (!socket) return;

    const handleVibeUp = (data) => {
      dispatch(
        updatePostFromSocket({
          postId: data.postId,
          vibesUp: data.vibesUp,
        })
      );
    };

    const handleVibeDown = (data) => {
      dispatch(
        updatePostFromSocket({
          postId: data.postId,
          vibesDown: data.vibesDown,
        })
      );
    };

    socket.on("postVibeUpdated", handleVibeUp);
    socket.on("postVibeDownUpdated", handleVibeDown);

    return () => {
      socket.off("postVibeUpdated", handleVibeUp);
      socket.off("postVibeDownUpdated", handleVibeDown);
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
       
        estimatedItemSize={650}
        onEndReached={() => {
          console.log('END REACHED', page);
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
        onViewableItemsChanged={handleViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 14,
                paddingHorizontal: 14,
              }}
            >
              <Pressable onPress={() => navigation.navigate('Notification')}>
                <MaterialCommunityIcons
                  style={{ paddingBottom: 10 }}
                  name="bell"
                  color="#000"
                  size={25}
                />
              </Pressable>
              <Text style={{ fontSize: 24 }}>Viby</Text>
              <FontAwesome
                style={{ paddingTop: 2 }}
                name="send"
                color="#000"
                size={20}
              />
            </View>
            <View
              style={{
                marginTop: 15,
                flex: 1 / 6,
                paddingTop: 12,
                marginBottom: 13,
              }}
            >
              <FlatList
                data={story}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponentStyle={{
                  marginRight: 15,
                }}
                horizontal={true}
                ListHeaderComponent={
                  <View>
                    <View
                      style={{
                        marginLeft: 10,
                        height: 90,
                        width: 90,
                        borderRadius: 100,
                        backgroundColor: 'white',
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                      style={{
                        height:85,
                        width:85,
                        borderRadius:100,
                        marginLeft: 2.5,
                      }}
                      source={{
                        uri:userAvatar
                      }}
                      />
                    
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        height: 25,
                        width: 25,
                        borderRadius: 100,
                        backgroundColor: 'black',
                        bottom: 4,
                        left: 78,
                      }}
                    >
                      <AntDesign
                        style={{ margin: 5 }}
                        name="plus"
                        color="#fff"
                        size={15}
                      />
                    </View>
                  </View>
                }
                renderItem={({ item }) => (
                  <View
                    style={{
                      height: 90,
                      width: 90,
                      borderRadius: 100,
                      backgroundColor: 'white',
                      marginRight: 15,
                      
                    }}
                  >
                    {/*borderWidth:2, borderColor:'green' when story upload */}
                  </View>
                )}
              />
            </View>

            <CustomToast
              visible={showToast}
              message="Logged out suiii 🚀"
              type="success"
            />
          </View>
        }
      />
      <View
        style={{
          elevation: 6,
          position: 'absolute',
          bottom: 58,
          right: 30,
          height: 50,
          width: 50,
          borderRadius: 100,
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Pressable onPress={handleLogout}>
          <AntDesign
            style={{ marginTop: 10 }}
            name="plus"
            color="#000"
            size={28}
          />
        </Pressable>
      </View>
      
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
