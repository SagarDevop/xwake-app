import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import ReelCard from '../Components/ReelCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchReels } from '../Redux/slices/feedSlice';
import PostSkeleton from '../Loader/PostSkeleton';

const { height } = Dimensions.get('window');

const Reels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();
  const [containerHeight, setContainerHeight] = useState(height);

  const {
    reels,
    reelsPage,
    reelsHasMore,
    reelsInitialLoading,
    reelsPaginationLoading,
  } = useSelector(state => state.feed);
  const dispatch = useDispatch();

  // const user = useSelector(state => state.auth.user);
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

  useEffect(() => {
    if (reels.length === 0) {
      dispatch(fetchReels({ page: 1, currentUserId: currentUserId }));
    }
  }, [dispatch, currentUserId]);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <ReelCard
          reel={item}
          isActive={index === activeIndex && isFocused}
          containerHeight={containerHeight}
        />
      );
    },
    [activeIndex, isFocused, containerHeight],
  );

  const handleLayout = useCallback(event => {
    const { height: layoutHeight } = event.nativeEvent.layout;
    setContainerHeight(prev => (prev === layoutHeight ? prev : layoutHeight));
  }, []);

  return (
    <View
      style={{ flex: 1 }}
      onLayout={handleLayout}
    >
      <FlashList
        data={reels}
        estimatedItemSize={containerHeight}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          console.log(
            'End reached! Current page:',
            reelsPage,
            '| Has more:',
            reelsHasMore,
          );
          if (reelsHasMore && !reelsPaginationLoading) {
            dispatch(fetchReels({ page: reelsPage + 1, currentUserId }));
          }
        }}
        ListFooterComponent={() =>
          reelsPaginationLoading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : null
        }
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
