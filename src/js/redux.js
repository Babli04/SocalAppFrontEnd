import { configureStore, createSlice } from '@reduxjs/toolkit';
import { rememberEnhancer, rememberReducer } from 'redux-remember';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    images: [],
    forum: [],
    links: [],
  },
  reducers: {
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setForum: (state, action) => {
      state.forum = action.payload;
    },
    setLinks: (state, action) => {
      state.links = action.payload;
    },
    editPost: (state, action) => {
      const { type, editedPost } = action.payload;
      state[type] = state[type].map((post) =>
        post.id === editedPost.id ? editedPost : post
      );
    },
    deletePost: (state, action) => {
      const { type, postId } = action.payload;
      state[type] = state[type].filter((post) => post.id !== postId);
    },
    addForum: (state, action) => {
      state.forum.push(action.payload);
    },
    addImage: (state, action) => {
      state.images.push(action.payload);
    },
    addLink: (state, action) => {
      state.links.push(action.payload);
    },
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    }
  }
})

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    username: null,
    email: null,
    isAdmin: false
  },
  reducers: {
    setSession: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
    }
  }
})

const reducers = {
  data: dataSlice.reducer,
  auth: authSlice.reducer,
  session: sessionSlice.reducer
};

export const actions = {
  ...dataSlice.actions,
  ...authSlice.actions,
  ...sessionSlice.actions
}

const rememberedKeys = [ 'auth' ];
const reducer = rememberReducer(reducers);
const store = configureStore({
  reducer,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(
    rememberEnhancer(
      window.localStorage,
      rememberedKeys
    )
  )
});

export default store;