import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialValue = {
  userinfo: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  theme: Cookies.get("theme")
    ? JSON.parse(Cookies.get("theme"))
    : window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
};
export const userSlice = createSlice({
  name: "user",
  initialState: initialValue,

  reducers: {
    login: (state, action) => {
      state.userinfo = action.payload.data.user;
      Cookies.set("user", JSON.stringify(action.payload.data.user), {
        expires: 9,
      });
    },
    updateProfilePhoto: (state, action) => {
      state.userinfo.photo = action.payload;
      Cookies.set("user", JSON.stringify(state.userinfo));
    },
    updateCoverPhoto: (state, action) => {
      state.userinfo.cover = action.payload;
      Cookies.set("user", JSON.stringify(state.userinfo));
    },
    updateRecivedRequestsCount: (state, action) => {
      state.userinfo.recivedRequestsCount = action.payload;
      Cookies.set("user", JSON.stringify(state.userinfo));
    },
    logout: (state, action) => {
      state.userinfo = null;
      Cookies.set("user", null);
    },
    changeTheme: (state, action) => {
      state.theme = action.payload;
      Cookies.set("theme", JSON.stringify(action.payload));
    },
  },
});
export const {
  login,
  logout,
  updateProfilePhoto,
  updateCoverPhoto,
  changeTheme,
  updateRecivedRequestsCount,
} = userSlice.actions;

export default userSlice.reducer;
