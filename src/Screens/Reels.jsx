import React, { useRef, useState } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import ReelCard from '../Components/ReelCard'

const { height } = Dimensions.get('window');

const reelsData = [
  { id: '2', video: 'https://www.w3schools.com/html/movie.mp4' },
  { id: '3', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

const Reels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 80,
  });

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={reelsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelCard
            video={item.video}
            isActive={index === activeIndex && isFocused} 
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  );
};

export default Reels;
