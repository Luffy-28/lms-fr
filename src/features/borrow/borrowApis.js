import { apiProcessor } from "../../helpers/axiosHelper";

export const BorrowBookApi = (bookId) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/borrows/" + bookId,
    method: "POST",
    isPrivate: true,
  });
};

export const fetchMyBorrowsApi = () => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/borrows/my-borrows",
    method: "GET",
    isPrivate: true,
  });
};
export const fetchAllBorrowedBooksApi = () => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/borrows",
    method: "GET",
    isPrivate: true,
  });
};

export const returnBookAPI = (borrowObj) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/borrows/return",
    method: "PATCH",
    data: borrowObj,
    isPrivate: true,
  });
};
