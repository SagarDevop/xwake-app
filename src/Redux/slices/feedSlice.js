import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';


export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async ({ page = 1, currentUserId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/post/all?page=${page}&limit=20`);

      const formattedPosts = res.data.posts.map(post => ({
        ...post,
        vibesUpCount: post.vibesUp?.length || 0,
        vibesDownCount: post.vibesDown?.length || 0,
        isVibedUp: post.vibesUp?.includes(currentUserId),
        isVibedDown: post.vibesDown?.includes(currentUserId),
      }));

      return { posts: formattedPosts, pagination: res.data.pagination, page };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);


export const fetchReels = createAsyncThunk(
  'feed/fetchReels',
  async ({ page = 1, currentUserId }, { rejectWithValue }) => {
    try {
      
      
      const res = await api.get(`/api/post/reels?page=${page}&limit=20`);

      const formattedReels = res.data.reels.map(reel => ({
        ...reel,
        vibesUpCount: reel.vibesUp?.length || 0,
        vibesDownCount: reel.vibesDown?.length || 0,
        isVibedUp: reel.vibesUp?.includes(currentUserId),
        isVibedDown: reel.vibesDown?.includes(currentUserId),
      }));
      return { reels: formattedReels, pagination: res.data.pagination, page };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const sendFeedback = createAsyncThunk(
  'feed/sendFeedback',
  async ({ postId, feedbackType }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/post/feedback/${postId}`, {
        feedbackType,
      });
      return {
        postId,
        vibesUpCount: res.data.vibesUpCount,
        vibesDownCount: res.data.vibesDownCount,
        isVibedUp: res.data.isVibedUp,
        isVibedDown: res.data.isVibedDown,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    
    posts: [],
    page: 1,
    hasMore: true,
    initialLoading: false,
    paginationLoading: false,

    
    reels: [],
    reelsPage: 1,
    reelsHasMore: true,
    reelsInitialLoading: false,
    reelsPaginationLoading: false,
  },
  reducers: {
  
    updatePostFromSocket: (state, action) => {
      const { postId, vibesUp, vibesDown, commentsCount } = action.payload;

      const index = state.posts.findIndex(item => item._id === postId);
      if (index === -1) return;

      if (vibesUp !== undefined) {
        state.posts[index].vibesUp = vibesUp;
        state.posts[index].vibesUpCount = vibesUp.length;
      }

      if (vibesDown !== undefined) {
        state.posts[index].vibesDown = vibesDown;
        state.posts[index].vibesDownCount = vibesDown.length;
      }

      if (commentsCount !== undefined) {
        state.posts[index].commentsCount = commentsCount;
      }
    },
  },
  extraReducers: builder => {
    builder
      
      .addCase(fetchFeed.pending, (state, action) => {
        if (action.meta.arg.page === 1) state.initialLoading = true;
        else state.paginationLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { posts = [], pagination, page } = action.payload;
        if (page === 1) {
          state.posts = posts;
          state.initialLoading = false;
        } else {
          state.posts = [...state.posts, ...posts];
          state.paginationLoading = false;
        }
        state.page = page;
        state.hasMore = pagination?.hasMorePosts ?? false;
      })
      .addCase(fetchFeed.rejected, state => {
        state.initialLoading = false;
        state.paginationLoading = false;
      })

      
      .addCase(fetchReels.pending, (state, action) => {
        if (action.meta.arg.page === 1) state.reelsInitialLoading = true;
        else state.reelsPaginationLoading = true;
      })
      .addCase(fetchReels.fulfilled, (state, action) => {
        const { reels = [], pagination, page } = action.payload;
        if (page === 1) {
          state.reels = reels;
          state.reelsInitialLoading = false;
        } else {
          
          const existingIds = new Set(state.reels.map(r => r._id));
          const uniqueNext = reels.filter(r => !existingIds.has(r._id));
          state.reels = [...state.reels, ...uniqueNext];
          state.reelsPaginationLoading = false;
        }
        state.reelsPage = page;
        const serverHasMore = pagination?.hasMoreReels;
        if (typeof serverHasMore === 'boolean') {
          state.reelsHasMore = serverHasMore;
        } else if (page === 1) {
          state.reelsHasMore = reels.length > 0;
        } else {
          const existingIds = new Set(state.reels.map(r => r._id));
         
          state.reelsHasMore = reels.some(r => !existingIds.has(r._id));
        }
      })
      .addCase(fetchReels.rejected, state => {
        state.reelsInitialLoading = false;
        state.reelsPaginationLoading = false;
      })

      
      .addCase(sendFeedback.pending, (state, action) => {
        const { postId, feedbackType } = action.meta.arg;

        
       
        const post = state.posts.find(p => p._id === postId);
        const reel = state.reels.find(r => r._id === postId);

       
        const applyOptimisticVibe = item => {
          if (feedbackType === 'vibeUp') {
            if (item.isVibedUp) {
              item.vibesUpCount--;
              item.isVibedUp = false;
            } else {
              item.vibesUpCount++;
              item.isVibedUp = true;
              if (item.isVibedDown) {
                item.vibesDownCount--;
                item.isVibedDown = false;
              }
            }
          }
          if (feedbackType === 'vibeDown') {
            if (item.isVibedDown) {
              item.vibesDownCount--;
              item.isVibedDown = false;
            } else {
              item.vibesDownCount++;
              item.isVibedDown = true;
              if (item.isVibedUp) {
                item.vibesUpCount--;
                item.isVibedUp = false;
              }
            }
          }
        };

       
        if (post) applyOptimisticVibe(post);
        if (reel) applyOptimisticVibe(reel);
      })
      .addCase(sendFeedback.fulfilled, (state, action) => {
        const { postId, vibesUpCount, vibesDownCount, isVibedUp, isVibedDown } =
          action.payload;

        const post = state.posts.find(p => p._id === postId);
        const reel = state.reels.find(r => r._id === postId);

        const syncWithServer = item => {
          item.vibesUpCount = vibesUpCount;
          item.vibesDownCount = vibesDownCount;
          item.isVibedUp = isVibedUp;
          item.isVibedDown = isVibedDown;
        };

        if (post) syncWithServer(post);
        if (reel) syncWithServer(reel);
      });
  },
});

export default feedSlice.reducer;
export const { updatePostFromSocket } = feedSlice.actions;
