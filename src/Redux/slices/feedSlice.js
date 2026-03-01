import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Fetch feed 
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
  }
);

// Send feedback (vibe up/down)
export const sendFeedback = createAsyncThunk(
  'feed/sendFeedback',
  async ({ postId, feedbackType }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/post/feedback/${postId}`, {
        feedbackType,
      });
      console.log('Feedback response:', res.data);
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
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    posts: [],
    page: 1,
    hasMore: true,
    initialLoading: false,
    paginationLoading: false,
  },
  reducers: {
    // For socket updat
    updatePostFromSocket: (state, action) => {
      const { postId, vibesUp, vibesDown } = action.payload;

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
    },
  },
  extraReducers: builder => {
    builder
  
      .addCase(fetchFeed.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.initialLoading = true;
        } else {
          state.paginationLoading = true;
        }
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
      .addCase(fetchFeed.rejected, (state, action) => {
        state.initialLoading = false;
        state.paginationLoading = false;
      })

      
      .addCase(sendFeedback.pending, (state, action) => {
        const { postId, feedbackType } = action.meta.arg;
        const post = state.posts.find(p => p._id === postId);
        if (!post) return;

        if (feedbackType === 'vibeUp') {
          if (post.isVibedUp) {
            post.vibesUpCount--;
            post.isVibedUp = false;
          } else {
            post.vibesUpCount++;
            post.isVibedUp = true;
            if (post.isVibedDown) {
              post.vibesDownCount--;
              post.isVibedDown = false;
            }
          }
        }

        if (feedbackType === 'vibeDown') {
          if (post.isVibedDown) {
            post.vibesDownCount--;
            post.isVibedDown = false;
          } else {
            post.vibesDownCount++;
            post.isVibedDown = true;
            if (post.isVibedUp) {
              post.vibesUpCount--;
              post.isVibedUp = false;
            }
          }
        }
      })
      .addCase(sendFeedback.fulfilled, (state, action) => {
        const { postId, vibesUpCount, vibesDownCount, isVibedUp, isVibedDown } =
          action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (!post) return;

        post.vibesUpCount = vibesUpCount;
        post.vibesDownCount = vibesDownCount;
        post.isVibedUp = isVibedUp;
        post.isVibedDown = isVibedDown;
      });
  },
});

export default feedSlice.reducer;
export const { updatePostFromSocket } = feedSlice.actions;