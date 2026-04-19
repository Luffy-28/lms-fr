import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    pendingReviews: [],
    allReviews: [],
  },

  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setPendingReviews: (state, action) => {
      state.pendingReviews = action.payload;
    },
    setAllReviews: (state, action) => {
      state.allReviews = action.payload;
    },
  },
});
export const { setReviews, setPendingReviews, setAllReviews } =
  reviewSlice.actions;
export default reviewSlice.reducer;