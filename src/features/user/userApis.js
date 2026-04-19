import { apiProcessor } from "../../helpers/axiosHelper";

export const loginApis = async (loginObject) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/auth/login",
    method: "POST",
    data: loginObject,
  });
};

export const signupApis = async (signupObject) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/auth/register",
    method: "POST",
    data: signupObject,
  });
};

export const verifyApis = async (verifyObject) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/auth/verify",
    method: "POST",
    data: verifyObject,
  });
};

export const getUserDetailApis = async () => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/users",
    method: "GET",
    isPrivate: true,
  });
};

export const getAllUserApis = async () => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/users/all",
    method: "GET",
    isPrivate: true,
  });
};
export const addUserApis = async (userObj) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/users/add",
    method: "POST",
    data: userObj,
    isPrivate: true,
  });
};

export const updateUserRoleApi = async (userObj) => {
  return apiProcessor({
    url: import.meta.env.VITE_ROOT_URL + "/api/v1/users/role",
    method: "PATCH",
    data: userObj,
    isPrivate: true,
  });
};
