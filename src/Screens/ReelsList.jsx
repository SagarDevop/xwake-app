import React, { useRef, useState, useMemo } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import api from '../api';
import { FlashList } from '@shopify/flash-list';

import ReelCard from '../Components/ReelCard';

const { height } = Dimensions.get('window');
import { useRoute } from '@react-navigation/native';

const ReelsList = () => {
  const route = useRoute();
  const selectedReel = route.params.selectedReel;
  const AllReels = route.params.AllReels;

  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();
  const [reels, setReels] = useState(AllReels);
  const flashListRef = useRef();

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

  console.log('all reels of user', AllReels);
  console.log('selected reels of user', selectedReel);

  const headerreelExists = reels.some(p => p._id === selectedReel._id);

  const otherreels = useMemo(
    () => reels.filter(p => p._id !== selectedReel._id),
    [reels, selectedReel._id],
  );

  const data = headerreelExists ? [selectedReel, ...otherreels] : otherreels;

  const handlePress = (index) => {
    setActiveIndex(index);
    flashListRef.current.scrollToIndex({ index, animated: true });
  };

  const renderItem = React.useCallback(
    ({ item, index }) => {
      return (
        <ReelCard 
          reel={item} 
          isActive={index === activeIndex && isFocused} 
          onPress={() => handlePress(index)} 
        />
      );
    },
    [activeIndex, isFocused],
  );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        ref={flashListRef}
        data={data}
        estimatedItemSize={height}
        keyExtractor={item => item._id}
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

export default ReelsList;

const styles = StyleSheet.create({});
