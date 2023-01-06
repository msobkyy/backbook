import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import createPostSlice from "./slices/createPostSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    createPost: createPostSlice,
  },
});
