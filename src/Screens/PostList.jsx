import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute, useIsFocused } from '@react-navigation/native';
import PostCard from '../Components/PostCard';
import ReelHCard from '../Components/ReelHCard';
import { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';

const PostList = () => {
  const route = useRoute();
  const selectedpost = route.params.selectedpost;
  const postIds = route.params.postIds;
  const isFocused = useIsFocused();
  const { posts } = useSelector(state => state.feed);
  const AllPosts = posts.filter(p => postIds.includes(p._id));
  

  const [visibleId, setVisibleId] = useState(null);

  const viewabilityRef = useRef();
  const listRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!hasScrolled && AllPosts.length > 0 && selectedpost) {
      const index = AllPosts.findIndex(p => p._id === selectedpost._id);
      if (index !== -1) {
        listRef.current?.scrollToIndex({ index, animated: false });
        setHasScrolled(true);
      }
    }
  }, [AllPosts, selectedpost, hasScrolled]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleId(viewableItems[0].item._id);
    }
  });

  const renderItem = useCallback(
    ({ item }) => {
      if (item.type === 'post') {
        return <PostCard post={item} />;
      } else {
        return <ReelHCard reel={item} isVisible={visibleId === item._id && isFocused} />;
      }
    },
    [visibleId, isFocused],
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlashList
      ref={listRef}
      style={{marginTop:55}}
      data={AllPosts}
      itemKeyExtractor={item => item._id}
      renderItem={renderItem}
      estimatedItemSize={500}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={handleViewableItemsChanged.current}
      removeClippedSubviews={true}
      />
    </View>
  );
};

export default PostList;

const styles = StyleSheet.create({});
