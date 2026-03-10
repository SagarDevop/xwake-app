import React, { useState, useCallback, use } from 'react';
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
import { useEffect } from 'react';
import api from '../api';

const { height } = Dimensions.get('window');

const CommentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  const userProfilePic = useSelector(state => state.auth.user?.profilePic?.url);
  const quickEmojis = ['❤️', '🙌', '🔥', '👏', '😍'];
  const user = useSelector(state => state.auth.user);

  const [inputText, setInputText] = useState('');
  const [comments, setComments] = useState([])
  const [commentLoading, setCommentLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() =>{
    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/comment/${postId}`);
        console.log('Fetched comments:', response.data.comments);
        setComments(response.data.comments);
        setCommentLoading(false);
      }
      catch(err){
        console.log('Error fetching comments:', err);
        setCommentLoading(false);
      }
    }
    fetchComments();
  }, [postId])

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
      
    
      if (parentId) {
        setComments((prev) =>
          prev.map((c) => {
            if (c._id === parentId) {
              return {
                ...c,
                replies: c.replies.filter((r) => r._id !== optimisticComment._id),
              };
            }
            return c;
          })
        );
      } else {
        setComments((prev) => prev.filter((c) => c._id !== optimisticComment._id));
      }
      
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
      <CommentItem 
        item={item} 
        setReplyingTo={setReplyingTo} 
        timeAgo={timeAgo} 
      />
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
          
          {/* Replaced logic starting from commentLoading */}
          {commentLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Loading comments...</Text>
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="comments-o" size={60} color="#d3d3d3" />
              <Text style={styles.emptyTitle}>No comments yet</Text>
              <Text style={styles.emptySubtitle}>Be the first to share your thoughts!</Text>
            </View>
          ) : (
            <FlashList
              data={comments}
              renderItem={renderItem}
              estimatedItemSize={70}
              keyExtractor={item => item.id || item._id} 
              contentContainerStyle={{ paddingBottom: 10 }}
              style={{ flex: 1 }}
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
              onSubmitEditing={handleAddComment}
            />
            <Pressable
              onPress={() => {
                handleAddComment();
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
    paddingHorizontal: 15,
    paddingVertical: 8,
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
    fontSize: 12.5,
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
 
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#949494',
    marginTop: 6,
    textAlign: 'center',
  },
  // Add these inside your styles object:
  replyingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderColor: '#ddd',
  },
  replyingText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
});


// Add this right above your CommentsScreen component
const CommentItem = ({ item, setReplyingTo, timeAgo }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <View style={styles.commentContainer}>
      {/* --- PARENT COMMENT --- */}
      <View style={styles.commentContent}>
        <Image source={{ uri: item.user?.profilePic?.url }} style={{ height: 38, width: 38, borderRadius: 100 }} />
        <View style={styles.commentTextContainer}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Text style={styles.username}>{item.user?.username}</Text>
            <Text style={{ color: "#b4b4b4", fontSize: 11 }}>{timeAgo(item.createdAt)}</Text>
          </View>
          <Text style={{ fontSize: 14, marginTop: 2 }}>{item.comment}</Text>
          
          <Pressable onPress={() => setReplyingTo({ commentId: item._id, username: item.user.username })}>
            <Text style={{ fontSize: 13, color: "#949494", marginTop: 4, fontWeight: '500' }}>Reply</Text>
          </Pressable>
        </View>
      </View>

      {/* --- NESTED REPLIES --- */}
      {item.replies && item.replies.length > 0 && (
        <View style={{ marginLeft: 48, marginTop: 10 }}>
          {!showReplies ? (
            // Toggle to open replies (Like Instagram's "---- View 2 replies")
            <Pressable onPress={() => setShowReplies(true)} style={styles.viewRepliesBtn}>
              <View style={styles.replyLine} />
              <Text style={styles.viewRepliesText}>
                View {item.replies.length} {item.replies.length === 1 ? 'reply' : 'replies'}
              </Text>
            </Pressable>
          ) : (
            // The actual replies
            <View>
              {item.replies.map((reply) => (
                <View key={reply._id} style={[styles.commentContent, { marginBottom: 15 }]}>
                  <Image source={{ uri: reply.user?.profilePic?.url }} style={{ height: 30, width: 30, borderRadius: 100 }} />
                  <View style={[styles.commentTextContainer, { flex: 1 }]}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <Text style={styles.username}>{reply.user?.username}</Text>
                      <Text style={{ color: "#b4b4b4", fontSize: 11 }}>{timeAgo(reply.createdAt)}</Text>
                    </View>
                    <Text style={{ fontSize: 14, marginTop: 2 }}>{reply.comment}</Text>
                    
                    {/* Notice how replying to a reply still attaches to the root commentId (item._id) */}
                    <Pressable onPress={() => setReplyingTo({ commentId: item._id, username: reply.user.username })}>
                      <Text style={{ fontSize: 13, color: "#949494", marginTop: 4, fontWeight: '500' }}>Reply</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
              
              // Toggle to close replies
              <Pressable onPress={() => setShowReplies(false)} style={styles.viewRepliesBtn}>
                <View style={styles.replyLine} />
                <Text style={styles.viewRepliesText}>Hide replies</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};