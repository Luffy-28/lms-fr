import { apiProcessor } from "../../helpers/axiosHelper";

export const addReviewApi = (borrowId, rating, reviewText) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/reviews/" + borrowId,
    method: "POST",
    isPrivate: true,
    data: {
      rating,
      review: reviewText,
    },
  });
};

export const getReviewsApi = () => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/reviews",
    method: "GET",
    isPrivate: false,
  });
};

export const getPendingReviewsApi = () => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/reviews/admin/pending",
    method: "GET",
    isPrivate: true,
  });
};

export const getAllReviewsAdminApi = () => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/reviews/admin/all",
    method: "GET",
    isPrivate: true,
  });
};

export const getReviewsByBookApi = (bookId) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/reviews/book/" + bookId,
    method: "GET",
    isPrivate: false,
  });
};

export const updateReviewApi = (_id, reviewData) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/reviews/" + _id,
    method: "PATCH",
    isPrivate: true,
    data: reviewData,
  });
};

export const deleteReviewApi = (_id) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/reviews/" + _id,
    method: "DELETE",
    isPrivate: true,
  });
};

export const approveReviewApi = (_id, reviewData) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/reviews/approve/" + _id,
    method: "PATCH",
    isPrivate: true,
    data: reviewData,
  });
};
