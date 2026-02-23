import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import React, { useRef } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Icon pool
const ICONS = [
  { pack: FontAwesome, name: 'heart' },
  { pack: FontAwesome, name: 'star' },
  { pack: Ionicons, name: 'chatbubble' },
  { pack: Ionicons, name: 'rocket' },
  { pack: MaterialIcons, name: 'favorite' },
  { pack: MaterialIcons, name: 'bolt' },
];

const random = (min, max) => Math.random() * (max - min) + min;

const FirstPage = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Login');
    });
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: 12 }).map((_, i) => {
        const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
        const IconComponent = icon.pack;

        return (
          <IconComponent
            key={i}
            name={icon.name}
            size={random(20, 40)}
            color="white"
            style={{
              position: 'absolute',
              top: random(0, height),
              left: random(0, width),
              opacity: 0.15,
            }}
          />
        );
      })}
      <Image
        source={require('../../assets/Icons/LogoV.png')}
        style={{ width: 120, height: 90, }}
      />
      <Text
      style={{marginTop:20, color:'white', fontWeight:600}}
      >Gen-z First Social App</Text>


     
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.button}
      >
        <Animated.View style={{ transform: [{ scale }], flexDirection: 'row', gap: 10 }}>
          <Text style={styles.buttonText}>Let's Go</Text>
          <FontAwesome name="send" color="#000" size={20} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default FirstPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8797f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 120,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
