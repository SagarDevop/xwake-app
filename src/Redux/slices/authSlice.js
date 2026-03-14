import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';


export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/user/me');
      console.log("FETCH USER SUCCESS:", res.data);
      return res.data;
    } catch (error) {
      console.log("FETCH USER ERROR:", error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);


export const followUser = createAsyncThunk(
  "auth/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/user/follow/" + userId);
      return { userId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to follow");
    }
  }
);

export const removeFollower = createAsyncThunk(
  "auth/removeFollower",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/api/user/follower/" + userId);
      return { userId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove");
    }
  }
);

export const updateProfilePic = createAsyncThunk(
  "auth/updateProfilePic",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/api/user/" + id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data; // Assuming backend returns { message, user: { profilePic: ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update pic");
    }
  }
);

export const updateProfileInfo = createAsyncThunk(
  "auth/updateProfileInfo",
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/api/user/" + id, profileData);
      return data; // Assuming backend returns updated user info
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update info");
    }
  }
);

export const togglePrivacy = createAsyncThunk(
  "auth/togglePrivacy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/api/user/privacy");
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle privacy");
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: true,
    isAuth: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: state => {
      state.token = null;
      state.user = null;
      state.isAuth = false;
      state.loading = false;
    },
  },

  extraReducers: builder => {
    builder
    
      .addCase(fetchUser.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchUser.rejected, state => {
        state.loading = false;
        state.user = null;
        state.isAuth = false;
        state.token = null;
      })

      
      .addCase(followUser.fulfilled, (state, action) => {
        if (!state.user) return;
        
       
        if (action.payload.data.followings) {
          state.user.followings = action.payload.data.followings;
        } else {
       
          const isFollowing = state.user.followings.includes(action.payload.userId);
          if (isFollowing) {
            state.user.followings = state.user.followings.filter(id => id !== action.payload.userId);
          } else {
            state.user.followings.push(action.payload.userId);
          }
        }
      })
      .addCase(removeFollower.fulfilled, (state, action) => {
        if (!state.user) return;
        state.user.followers = state.user.followers.filter(
          (id) => id !== action.payload.userId
        );
      })


      .addCase(updateProfilePic.fulfilled, (state, action) => {
        
        if (state.user && action.payload.user?.profilePic) {
          state.user.profilePic = action.payload.user.profilePic;
        }
      })

     
      .addCase(updateProfileInfo.fulfilled, (state, action) => {
        if (state.user && action.payload.user) {
          
          state.user = { ...state.user, ...action.payload.user };
        }
      })

     
      .addCase(togglePrivacy.fulfilled, (state, action) => {
        if (state.user) {
          state.user.isPrivate = action.payload.isPrivate !== undefined 
            ? action.payload.isPrivate 
            : !state.user.isPrivate;
        }
      });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;