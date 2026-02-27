import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/post/all?page=${page}&limit=20`);
      console.log('API RESPONSE:', res.data);
      return { ...res.data, page };
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
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(fetchFeed.pending, (state, action) => {
        if (action.meta.arg === 1) {
          state.initialLoading = true;
        } else {
          state.paginationLoading = true;
        }
      })

     
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { posts = [], reels = [], pagination } = action.payload;

        if (action.meta.arg === 1) {
          state.posts = posts;
          state.reels = reels;
          state.initialLoading = false;
        } else {
          state.posts = [...state.posts, ...posts];
          state.reels = [...state.reels, ...reels];
          state.paginationLoading = false;
        }

        state.page = action.meta.arg;
        state.hasMore = pagination?.hasMorePosts || pagination?.hasMoreReels;
      })

      
      .addCase(fetchFeed.rejected, (state, action) => {
        if (action.meta.arg === 1) {
          state.initialLoading = false;
        } else {
          state.paginationLoading = false;
        }
      });
  },
});

export default feedSlice.reducer;
