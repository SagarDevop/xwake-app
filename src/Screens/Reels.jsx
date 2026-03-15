import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import api from '../api';
import { FlashList } from '@shopify/flash-list';
import ReelCard from '../Components/ReelCard'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';




const { height } = Dimensions.get('window');

const Reels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();
  const [containerHeight, setContainerHeight] = useState(height);

  const { posts, page, hasMore, initialLoading, paginationLoading } =
      useSelector(state => state.feed);
   
    
  const currentUserId = useSelector(state => state.auth.user._id);

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 80,
  });

 const onViewRef = useRef(({ viewableItems }) => {
  if (viewableItems.length > 0) {
    const newIndex = viewableItems[0].index;

    setActiveIndex(prevIndex => {
      if (prevIndex !== newIndex) {
        return newIndex;
      }
      return prevIndex;
    });
  }
});

  //


  const reelData = posts?.filter(item => item.type === "reel")

  console.log('reel data in reels', reelData)

  const renderItem = React.useCallback(({ item, index }) => {
  return (
    <ReelCard
      reel={item}
      isActive={index === activeIndex && isFocused}
      containerHeight={containerHeight}
    />
  );
}, [activeIndex, isFocused, containerHeight]);

  return (
    <View style={{ flex: 1 }} onLayout={(event) => {
      const { height: layoutHeight } = event.nativeEvent.layout;
      setContainerHeight(layoutHeight);
    }}>
      <FlashList
        data={reelData}
        estimatedItemSize={containerHeight}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        pagingEnabled
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  );
};

export default Reels;
