import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const { height } = Dimensions.get('window');

const ThreeDotScreen = () => {
  const route = useRoute();
  const { postValue } = route.params;
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);

  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);


  const gesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate(event => {
      const newValue = startY.value + event.translationY;
      if (newValue >= 0) {
        translateY.value = newValue;
      }
    })
    .onEnd(() => {
      if (translateY.value > height * 0.1) {
        runOnJS(navigation.goBack)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));


  const handleSavePost = () => {
    console.log('Saved post:', postValue?.id);
    navigation.goBack();
  };

  const handleNotInterested = () => {
    console.log('Not interested in post');
    navigation.goBack();
  };

  const handleMuteUser = () => {
    console.log('Muted user');
    navigation.goBack();
  };

  const handleBlockUser = () => {
    Alert.alert(
      'Block User',
      'Are you sure you want to block this user? You will no longer see their posts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Block', 
          style: 'destructive',
          onPress: () => {
            console.log('Blocked user');
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.sheet, animatedStyle]}>
        <GestureDetector gesture={gesture}>
          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
          
            <View style={styles.dragHandle} />

          
            <View style={styles.header}>
              <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
                <AntDesign name="down" color="#000" size={24} />
              </Pressable>
              <Text style={styles.headerTitle}>Options</Text>
              <View style={{ width: 24 }} /> 
            </View>

       
            <View style={styles.optionsContainer}>
              
              <Pressable style={styles.optionRow} onPress={handleSavePost}>
                <FontAwesome name="bookmark-o" size={24} color="#333" style={styles.optionIcon} />
                <Text style={styles.optionText}>Save Post</Text>
              </Pressable>

              <Pressable style={styles.optionRow} onPress={handleNotInterested}>
                <FontAwesome name="eye-slash" size={22} color="#333" style={styles.optionIcon} />
                <Text style={styles.optionText}>Not Interested</Text>
              </Pressable>

              <Pressable style={styles.optionRow} onPress={handleMuteUser}>
                <FontAwesome name="volume-off" size={26} color="#333" style={styles.optionIcon} />
                <Text style={styles.optionText}>Mute User</Text>
              </Pressable>

            
              <Pressable style={styles.optionRow} onPress={handleBlockUser}>
                <FontAwesome name="ban" size={22} color="#FF3B30" style={styles.optionIcon} />
                <Text style={[styles.optionText, { color: '#FF3B30' }]}>Block User</Text>
              </Pressable>

            </View>

          </View>
        </GestureDetector>
      </Animated.View>
    </View>
  );
};

export default ThreeDotScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)', 
  },
  sheet: {
    height: height * 0.45, 
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#000',
  },
  optionsContainer: {
    paddingVertical: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionIcon: {
    width: 35, 
    textAlign: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 15,
  },
});