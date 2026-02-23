import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

  //state for post
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
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

  const fetchFeed = async (pageNumber = 1) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await api.get(`/api/post/all?page=${pageNumber}&limit=20`);
      console.log(res.data);
      const newPosts = res.data.posts;
      const newReels = res.data.reels;

      setPosts(prev => (pageNumber === 1 ? newPosts : [...prev, ...newPosts]));
      setReels(prev => (pageNumber === 1 ? newReels : [...prev, ...newReels]));

      setHasMore(
        res.data.pagination.hasMorePosts || res.data.pagination.hasMoreReels,
      );
      setPage(pageNumber);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(1);
  }, []);

  // i am combinig post and reel accoording TO as they are created

  const combinedFeed = useMemo(() => {
  return [...posts, ...reels].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}, [posts, reels]);


  // render on time

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'post') {
      return <PostCard post={item} />;
    } else {
      return <ReelHCard reel={item} />;
    }
  }, []);

  //
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const handleViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    changed.forEach(item => {
      item.item.__setVisibility?.(item.isViewable);
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={combinedFeed}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        estimatedItemSize={650}
        onEndReached={() => fetchFeed(page + 1)}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={handleViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
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
                      }}
                    >
                      {/*borderWidth:2, borderColor:'green' when story upload */}
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
