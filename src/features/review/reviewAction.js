import {
  addReviewApi,
  approveReviewApi,
  deleteReviewApi,
  getAllReviewsAdminApi,
  getReviewsApi,
  getReviewsByBookApi,
  getPendingReviewsApi,
  updateReviewApi,
} from "./reviewApis";
import { setReviews, setPendingReviews, setAllReviews } from "./reviewSlice";
import { fetchMyBorrow } from "../borrow/borrowAction";

export const addReview = (borrowId, review, rating) => async (dispatch) => {
  const data = await addReviewApi(borrowId, rating, review);
  if (data.status === "success") {
    dispatch(fetchMyBorrow());
  }
  return data;
};

export const getReviews = () => async (dispatch) => {
  const data = await getReviewsApi();
  if (data.status === "success") {
    dispatch(setReviews(data.reviews));
  }
};

export const getPendingReviews = () => async (dispatch) => {
  const data = await getPendingReviewsApi();
  if (data.status === "success") {
    dispatch(setPendingReviews(data.reviews));
  }
  return data;
};

export const getAllReviewsAdmin = () => async (dispatch) => {
  const data = await getAllReviewsAdminApi();
  if (data.status === "success") {
    dispatch(setAllReviews(data.reviews));
  }
  return data;
};

export const getReviewsByBook = (bookId) => async (dispatch) => {
  const data = await getReviewsByBookApi(bookId);
  if (data.status === "success") {
    dispatch(setReviews(data.reviews));
  }
};

export const updateReview = (_id, reviewData) => async (dispatch) => {
  const data = await updateReviewApi(_id, reviewData);
  if (data.status === "success") {
    dispatch(getReviews());
  }
};

export const deleteReview = (_id) => async (dispatch) => {
  const data = await deleteReviewApi(_id);
  if (data.status === "success") {
    dispatch(getPendingReviews());
    dispatch(getAllReviewsAdmin());
  }
  return data;
};

export const approveReview = (_id, reviewData) => async (dispatch) => {
  const data = await approveReviewApi(_id, reviewData);
  if (data.status === "success") {
    dispatch(getPendingReviews());
    dispatch(getAllReviewsAdmin());
  }
  return data;
};
