import { createSlice } from "@reduxjs/toolkit";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    publicBooks: [],
    publicBooksTotalPage: 0,
    borrowedBooks: [],
    searchBooks: null,
  },

  reducers: {
    setSearchBooks: (state, action) => {
      state.searchBooks = action.payload;
    },
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    setPublicBooks: (state, action) => {
      state.publicBooks = action.payload;
    },
    setPublicBooksTotalPage: (state, action) => {
      state.publicBooksTotalPage = action.payload;
    },
    setBorrowedBooks: (state, action) => {
      state.borrowedBooks = action.payload;
    },
  },
});
export const {
  setBooks,
  setPublicBooks,
  setBorrowedBooks,
  setSearchBooks,
  setPublicBooksTotalPage,
} = bookSlice.actions;
export default bookSlice.reducer;
