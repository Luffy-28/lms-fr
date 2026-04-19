import { apiProcessor } from "../../helpers/axiosHelper";

export const fetchAllBooksApi = () => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/books",
    method: "GET",
    isPrivate: true,
  });
};

export const fetchAllPublicBooksApi = (page = 1, limit = 5, search = "") => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/books/public?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  });
};

export const addBookApi = async (bookData) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/books",
    method: "POST",
    data: bookData,
    contentType:
      bookData instanceof FormData ? "multipart/form-data" : undefined,
    isPrivate: true,
  });
};

export const deleteBookApi = async (_id) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/books/" + _id,
    method: "DELETE",
    isPrivate: true,
  });
};
export const updateBookApi = async (_id, bookData) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/books/" + _id,
    method: "patch",
    data: bookData,
    contentType:
      bookData instanceof FormData ? "multipart/form-data" : undefined,
    isPrivate: true,
  });
};

export const borrowBookApi = async (_id) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/borrows/" + _id,
    method: "POST",
    isPrivate: true,
  });
};

export const searchBooksApi = async (query) => {
  return apiProcessor({
    url:
      import.meta.env.VITE_ROOT_URL +
      `/api/v1/books/search?query=${encodeURIComponent(query)}`,
    method: "GET",
  });
};
export const updateStatusBookApi = async (_id, status) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/books/status",
    method: "PATCH",
    data: { status },
    isPrivate: true,
  });
};
