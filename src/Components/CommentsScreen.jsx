import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import { runOnJS } from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const { height } = Dimensions.get('window');

const CommentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  const userProfilePic = useSelector(state => state.auth.user?.profilePic?.url);
  const [inputText, setInputText] = useState('');

  const quickEmojis = ['❤️', '🙌', '🔥', '👏', '😍'];

  const [comments] = useState([
    { id: '1', user: 'John', text: 'Nice post!', type: 'comment', url: 'https://randomuser.me/api/portraits/men/1.jpg'},
    { id: '2', user: 'John', text: 'Nice post1!', type: 'comment', url: 'https://randomuser.me/api/portraits/men/2.jpg'},
    { id: '3', user: 'John', text: 'Nice post2!', type: 'comment', url: 'https://randomuser.me/api/portraits/men/3.jpg'},
    { id: '4', user: 'John', text: 'Nice post3!', type: 'comment', url: 'https://randomuser.me/api/portraits/men/4.jpg'},
    { id: '5', user: 'John', text: 'Nice post!4', type: 'comment', url: 'https://randomuser.me/api/portraits/men/5.jpg'},
    { id: '6', user: 'John', text: 'Nice post!5', type: 'comment', url: 'https://randomuser.me/api/portraits/men/6.jpg'},
    { id: '7', user: 'John', text: 'Nice post!6', type: 'comment', url: 'https://randomuser.me/api/portraits/men/7.jpg'},
    { id: '8', user: 'John', text: 'Nice post!7', type: 'comment', url: 'https://randomuser.me/api/portraits/men/8.jpg'},
    { id: '9', user: 'Alex', text: 'Agree ', type: 'reply', url: 'https://randomuser.me/api/portraits/men/9.jpg'},
  ]);

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

  const renderItem = useCallback(({ item }) => {
    return (
      <View
        style={[
          styles.commentContainer,
          item.type === 'reply' && styles.replyContainer,
        ]}
      >
        <View style={styles.commentContent}>
          <Image source={{ uri: item.url }} style={{height: 40, width:40, borderRadius:100}} />
          <View style={styles.commentTextContainer}>
            <Text style={styles.username}>{item.user}</Text>
            <Text>{item.text}</Text>
          </View>
        </View>
      </View>
    );
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.sheet, animatedStyle]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <GestureDetector gesture={gesture}>
            <View style={{ backgroundColor: 'transparent' }}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                  <AntDesign name="down" color="#000" size={24} />
                </Pressable>
                <Text style={styles.headerTitle}>Comments</Text>
                <View style={{ width: 22 }} />
              </View>
            </View>
          </GestureDetector>

          <FlashList
            data={comments}
            renderItem={renderItem}
            estimatedItemSize={70}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 10 }}
            style={{ flex: 1 }}
          />
          <View style={styles.emojiRow}>
            {quickEmojis.map((emoji, index) => (
              <Pressable
                key={index}
                onPress={() => setInputText(prev => prev + emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.inputContainer}>
            <Image
             source={{
              uri:userProfilePic
             }}
             style ={styles.profilePic}
            />
            <TextInput
              placeholder="Add a comment..."
              style={styles.input}
              value={inputText}
              onChangeText={setInputText} 
            />
            <Pressable
              onPress={() => {
                
                console.log('Posting:', inputText);
                setInputText(''); 
              }}
            >
              <FontAwesome style={styles.sendIcon} name="send" color="#000" size={21} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    flex: 1,

    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  commentContainer: {
    padding: 15,
  },
  commentContent:{
 flexDirection:'row',
  },
  replyContainer: {
    marginLeft: 40,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  commentTextContainer:{
    marginLeft: 10,
      justifyContent: 'center',


  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 15,
    backgroundColor: '#fff', 
    borderTopWidth: 0.5,
    borderColor: '#ddd',
  },
  emojiText: {
    fontSize: 23, 
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  profilePic:{
    width: 35,
    height: 35,
    borderRadius: 100,
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor:"#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendIcon: {
    margin: 8,

  },
});
