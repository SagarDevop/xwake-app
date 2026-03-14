import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import PostCard from '../Components/PostCard';
import ReelHCard from '../Components/ReelHCard';
import { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { FlashList } from '@shopify/flash-list';

const PostList = () => {
  const route = useRoute();
  const selectedpost = route.params.selectedpost;
  const AllPosts = route.params.AllPosts;
  

  const [visibleId, setVisibleId] = useState(null);

  const viewabilityRef = useRef();

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
        return <ReelHCard reel={item} isVisible={visibleId === item._id} />;
      }
    },
    [visibleId],
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlashList
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
