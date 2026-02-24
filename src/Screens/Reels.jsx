import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import api from '../api';
import { FlashList } from '@shopify/flash-list';

import ReelCard from '../Components/ReelCard'

const { height } = Dimensions.get('window');

const Reels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();
  const [reels, setReels] = useState([]);

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

  const fetchreels = async () => {
   try {
     const res = await api.get('/api/post/all?page=1&limit=20')
     console.log(res.data.reels);
     setReels(res.data.reels);
   } catch (error) {
      console.log(error);
    
   }
  }

  useEffect(() => {
    fetchreels();
  }, []);

  const renderItem = React.useCallback(({ item, index }) => {
  return (
    <ReelCard
      reel={item}
      isActive={index === activeIndex && isFocused}
    />
  );
}, [activeIndex, isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={reels}
        estimatedItemSize={height}
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
