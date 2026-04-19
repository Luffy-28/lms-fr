import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    allUsers: [],
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
  },
});
export const { setUser, logout, setAllUsers } = userSlice.actions;
export default userSlice.reducer;
