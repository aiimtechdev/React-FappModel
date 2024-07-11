import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem("token");
const initialState = token ? {
  isLogin: true,
  currentUser: {},
  routing: ''
} : { isLogin: false, currentUser: {} };
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.isLogin = true;
    },
    routeName(state, action) {
      state.routing = action.payload;
    }
  },
});

export const { setCurrentUser, routeName } = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
