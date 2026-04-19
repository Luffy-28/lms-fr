import { fetchAllPublicBooks } from "../book/bookAction";
import {
  BorrowBookApi,
  fetchAllBorrowedBooksApi,
  fetchMyBorrowsApi,
  returnBookAPI,
} from "./borrowApis";
import { setBorrows } from "./borrowSlice";

export const borrowBook = (bookId) => async (dispatch) => {
  const data = await BorrowBookApi(bookId);

  if (data.status === "success") {
    // fetch all borrows again
    dispatch(fetchAllPublicBooks());
  }
};

export const fetchMyBorrow = () => async (dispatch) => {
  const data = await fetchMyBorrowsApi();

  if (data.status === "success") {
    dispatch(setBorrows(data.borrows));
  }
};
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  // 1. call fetch all book api
  const data = await fetchAllBorrowedBooksApi();
  // 2. update the redux store
  dispatch(setBorrows(data.borrow));
};
export const returnBook = (borrowObj) => async (dispatch) => {
  const returnObj = { _id: borrowObj._id };
  const data = await returnBookAPI(returnObj);
  if (data.status === "success") {
    dispatch(fetchMyBorrow());
  } else {
    alert(data.message || "failed to return book");
  }
};
