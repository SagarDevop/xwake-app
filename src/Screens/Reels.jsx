// src/Screens/Reels.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import ReelCard from '../Components/ReelCard';
import { useSelector, useDispatch, shallowEqual } from 'react-redux'; // JARVIS: shallowEqual added
import { fetchReels } from '../Redux/slices/feedSlice';
import PostSkeleton from '../Loader/PostSkeleton';

const { height } = Dimensions.get('window');

const Reels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();
  const [containerHeight, setContainerHeight] = useState(height);
  const dispatch = useDispatch();

  // JARVIS: Strict Selector Engine. Sirf Reels ke data pe re-render hoga, Posts pe nahi.
  const { reels, reelsPage, reelsHasMore, reelsInitialLoading, reelsPaginationLoading } = useSelector(
    state => ({
      reels: state.feed.reels,
      reelsPage: state.feed.reelsPage,
      reelsHasMore: state.feed.reelsHasMore,
      reelsInitialLoading: state.feed.reelsInitialLoading,
      reelsPaginationLoading: state.feed.reelsPaginationLoading,
    }),
    shallowEqual
  );

  const currentUserId = useSelector(state => state.auth.user._id);

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 80,
  });

  

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index); // JARVIS: Simplified
    }
  });

  useEffect(() => {
    if (reels.length === 0) {
      dispatch(fetchReels({ page: 1, currentUserId }));
    }
  }, [dispatch, currentUserId]);

  // JARVIS: Bulletproof renderItem. No dependencies! Uses extraData instead.
  const renderItem = useCallback(({ item, index, extraData }) => {
    return (
      <ReelCard
        reel={item}
        isActive={index === extraData.activeIndex && extraData.isFocused}
        containerHeight={extraData.containerHeight}
      />
    );
  }, []); // <-- EMPTY DEPENDENCY ARRAY

  const handleLayout = useCallback(event => {
    const { height: layoutHeight } = event.nativeEvent.layout;
    setContainerHeight(prev => (prev === layoutHeight ? prev : layoutHeight));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }} onLayout={handleLayout}>
      <FlashList
        data={reels}
        estimatedItemSize={containerHeight || height}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        // JARVIS: Pass dynamic states here so list doesn't re-evaluate blindly
        extraData={{ activeIndex, isFocused, containerHeight }} 
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (reelsHasMore && !reelsPaginationLoading) {
            dispatch(fetchReels({ page: reelsPage + 1, currentUserId }));
          }
        }}
        ListFooterComponent={() =>
          reelsPaginationLoading ? (
            <View style={{ height: containerHeight, justifyContent: 'center' }}>
               {/* Use a proper Reel skeleton here if you want */}
              <PostSkeleton />
            </View>
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