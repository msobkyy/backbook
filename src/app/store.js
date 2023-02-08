import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import createPostSlice from "./slices/createPostSlice";
import createSoketSlice from "./slices/soketSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    createPost: createPostSlice,
    soketSlice: createSoketSlice,
  },
});
