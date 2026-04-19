import {
  addUserApis,
  getAllUserApis,
  getUserDetailApis,
  loginApis,
  updateUserRoleApi,
} from "./userApis";
import { setAllUsers, setUser } from "./userSlice";

export const login = (formData) => async (dispatch) => {
  const data = await loginApis(formData);

  if (data.status === "success") {
    // Store token first so the next API call can use it
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    } else {
      alert("Not token");
      return false;
    }

    const userResponse = await getUserDetailApis();

    dispatch(
      setUser({
        user: userResponse.user,
      }),
    );

    alert("Login successful");
    return true;
  } else {
    alert(data.message || "Login failed");
    return false;
  }
};

export const autoLogin = () => async (dispatch) => {
  // 1. get token
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    // 2. get user details
    const userResponse = await getUserDetailApis();
    if (userResponse.status == "success") {
      dispatch(
        setUser({
          user: userResponse.user,
        }),
      );
    }
  }
};

export const getAllUser = () => async (dispatch) => {
  const data = await getAllUserApis();

  dispatch(setAllUsers(data.users));
};

export const addUser = (userObj) => async (dispatch) => {
  const data = await addUserApis(userObj);

  if (data.status === "success") {
    dispatch(getAllUser());
  }
};

export const updateUserRole = (userObj) => async (dispatch) => {
  const data = await updateUserRoleApi(userObj);

  if (data.status === "success") {
    dispatch(getAllUser());
  } else {
    alert(data.message || "Failed to update role");
  }
};
