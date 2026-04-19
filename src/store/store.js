import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import bookReducer from "../features/book/bookSlice";
import borrowReducer from "../features/borrow/borrowSlice";
import reviewReducer from "../features/review/reviewSlice";

export const store = configureStore({
  reducer: {
    userStore: userReducer,
    bookStore: bookReducer,
    borrowStore: borrowReducer,
    reviewStore: reviewReducer,
  },
});
