import {
  setBooks,
  setBorrowedBooks,
  setPublicBooks,
  setPublicBooksTotalPage,
  setSearchBooks,
} from "./bookSlice";
import {
  addBookApi,
  borrowBookApi,
  deleteBookApi,
  fetchAllBooksApi,
  fetchAllPublicBooksApi,
  searchBooksApi,
  updateBookApi,
  updateStatusBookApi,
} from "./bookApis";

export const fetchAllBooks = () => async (dispatch) => {
  // 1. call fetch all book api
  const data = await fetchAllBooksApi();
  // 2. update the redux store
  dispatch(setBooks(data.books));
};

export const addNewBoook = (bookData) => async (dispatch) => {
  console.log(bookData);
  const data = await addBookApi(bookData);

  if (data.status === "success") {
    //fetch all the books again
    dispatch(fetchAllBooks());
  }
};

export const deleteBook = (_id) => async (dispatch) => {
  const data = await deleteBookApi(_id);

  if (data.status === "success") {
    dispatch(fetchAllBooks());
  }
};

export const updateBook = (_id, bookData) => async (dispatch) => {
  const data = await updateBookApi(_id, bookData);

  if (data.status === "success") {
    dispatch(fetchAllBooks());
  }
};

// FETCH ALL AVALIABLE BOOKS FOR PUBLIC
export const fetchAllPublicBooks =
  (page, limit, search) => async (dispatch) => {
    // 1. fetch public books api
    const data = await fetchAllPublicBooksApi(page, limit, search);
    // 2. fill publicBooks in the book store
    if (data.status == "success") {
      dispatch(setPublicBooks(data.books));
      dispatch(setPublicBooksTotalPage(data.totalPage));
    }
  };

export const borrowBook = (_id) => async (dispatch) => {
  const data = await borrowBookApi(_id);
  if (data.status === "success") {
    //fetch all the books again
    dispatch(fetchAllPublicBooks());
  }
};

export const searchBooks = (query) => async (dispatch) => {
  const data = await searchBooksApi(query);
  if (data.status === "success") {
    dispatch(setSearchBooks(data.books));
  }
};

export const updateStatusBook = (_id, status) => async (dispatch) => {
  const data = await updateStatusBookApi(_id, status);
  if (data.status === "success") {
    dispatch(fetchAllBooks());
  }
};
