import React, { useState, useCallback, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import api from '../api';

const { height } = Dimensions.get('window');

const ReelCommentsModal = ({ postId, visible, onClose }) => {
  const userProfilePic = useSelector(state => state.auth.user?.profilePic?.url);
  const user = useSelector(state => state.auth.user);
  const quickEmojis = ['❤️', '🙌', '🔥', '👏', '😍'];

  const [inputText, setInputText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);

  // Reset animations and fetch comments when modal opens
  useEffect(() => {
    if (visible) {
      translateY.value = 0; // Reset position
      fetchComments();
    }
  }, [visible, postId]);

  const fetchComments = async () => {
    setCommentLoading(true);
    try {
      const response = await api.get(`/api/comment/${postId}`);
      setComments(response.data.comments);
    } catch (err) {
      console.log('Error fetching comments:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!inputText.trim()) return;

    const textToPost = inputText;
    setInputText('');

    const parentId = replyingTo ? replyingTo.commentId : null;

    const optimisticComment = {
      _id: Math.random().toString(),
      comment: textToPost,
      createdAt: new Date().toISOString(),
      user: {
        _id: user._id,
        username: user.username,
        profilePic: { url: user?.profilePic?.url },
      },
      type: replyingTo ? 'reply' : 'comment',
      parentComment: parentId,
      replies: [],
    };

    if (parentId) {
      setComments((prev) =>
        prev.map((c) => {
          if (c._id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), optimisticComment],
            };
          }
          return c;
        })
      );
    } else {
      setComments((prev) => [optimisticComment, ...prev]);
    }

    setReplyingTo(null);

    try {
      const response = await api.post(`/api/comment/${postId}`, {
        comment: textToPost,
        parentComment: parentId,
      });

      if (parentId) {
        setComments((prev) =>
          prev.map((c) => {
            if (c._id === parentId) {
              return {
                ...c,
                replies: c.replies.map((r) =>
                  r._id === optimisticComment._id ? response.data.comment : r
                ),
              };
            }
            return c;
          })
        );
      } else {
        setComments((prev) =>
          prev.map((c) => (c._id === optimisticComment._id ? response.data.comment : c))
        );
      }
    } catch (error) {
      console.log('Error posting comment:', error);
      // Rollback logic (simplified for brevity, you can keep your original rollback logic here)
      alert(error.response?.data?.message || 'Failed to post comment');
    }
  };

  const timeAgo = iso => {
    const seconds = Math.floor((new Date() - new Date(iso)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  // --- Animation & Gesture Logic ---
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
      if (translateY.value > height * 0.2) {
        // If dragged down far enough, close the modal
        runOnJS(onClose)();
      } else {
        // Otherwise, spring back to top
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const renderItem = useCallback(({ item }) => {
    return (
      <CommentItem 
        item={item} 
        setReplyingTo={setReplyingTo} 
        timeAgo={timeAgo} 
      />
    );
  }, []);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide" // React Native handles the slide up nicely!
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Pressable background to close the modal when tapping outside the sheet */}
        <Pressable style={styles.backgroundTap} onPress={onClose} />
        
        <Animated.View style={[styles.sheet, animatedStyle]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <GestureDetector gesture={gesture}>
              <View style={{ backgroundColor: 'transparent' }}>
                <View style={styles.dragHandle} />
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Comments</Text>
                  <Pressable onPress={onClose}>
                    <AntDesign name="close" color="#000" size={24} />
                  </Pressable>
                </View>
              </View>
            </GestureDetector>

            {commentLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="comments-o" size={60} color="#d3d3d3" />
                <Text style={styles.emptyTitle}>No comments yet</Text>
              </View>
            ) : (
              <FlashList
                data={comments}
                renderItem={renderItem}
                estimatedItemSize={70}
                keyExtractor={item => item.id || item._id} 
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            )}

            {replyingTo && (
              <View style={styles.replyingBanner}>
                <Text style={styles.replyingText}>Replying to {replyingTo.username}</Text>
                <Pressable onPress={() => setReplyingTo(null)}>
                  <AntDesign name="close" size={16} color="#666" />
                </Pressable>
              </View>
            )}

            <View style={styles.emojiRow}>
              {quickEmojis.map((emoji, index) => (
                <Pressable key={index} onPress={() => setInputText(prev => prev + emoji)}>
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.inputContainer}>
              <Image source={{ uri: userProfilePic }} style={styles.profilePic} />
              <TextInput
                placeholder="Add a comment..."
                style={styles.input}
                value={inputText}
                onChangeText={setInputText} 
                onSubmitEditing={handleAddComment}
              />
              <Pressable onPress={handleAddComment}>
                <FontAwesome style={styles.sendIcon} name="send" color="#000" size={21} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ... Include your existing CommentItem component here ...
const CommentItem = ({ item, setReplyingTo, timeAgo }) => { /* Your exact code */ return null; }

export default ReelCommentsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)', // Dims the Reel slightly when open
  },
  backgroundTap: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    height: height * 0.65, // Adjust this! 65% of screen height looks like Insta
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  // ... Include ALL your existing styles from CommentsScreen here ...
  dragHandle: { width: 40, height: 5, backgroundColor: '#ccc', alignSelf: 'center', marginVertical: 8, borderRadius: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: '#ddd' },
  headerTitle: { fontWeight: '600', fontSize: 16 },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 5, backgroundColor: '#fff', borderTopWidth: 0.5, borderColor: '#ddd' },
  emojiText: { fontSize: 23 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
  profilePic: { width: 35, height: 35, borderRadius: 100, marginRight: 10 },
  input: { flex: 1, backgroundColor: "#f0f0f0", borderRadius: 20, paddingHorizontal: 15, height: 40 },
  sendIcon: { marginHorizontal: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 16, color: '#949494', marginTop: 10 },
});