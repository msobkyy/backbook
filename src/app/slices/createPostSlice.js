import { createSlice } from "@reduxjs/toolkit";

// type = ['normal','image','background']

const initialValue = {
  isOpen: false,
  type: "normal",
  postText: "",
  background: null,
  images: [],
};
export const createPostSlice = createSlice({
  name: "createPost",
  initialState: initialValue,

  reducers: {
    type: (state, action) => {
      state.type = action.payload;
      if (action.payload === "normal" || action.payload === "background") {
        state.images = [];
      }
    },
    images: (state, action) => {
      state.images.push(action.payload);
    },
    background: (state, action) => {
      state.type = "background";
      state.background = action.payload;
    },
    postText: (state, action) => {
      state.postText = action.payload;
    },
    open: (state, action) => {
      if (state.isOpen) state.type = "normal";
      state.isOpen = !state.isOpen;
      if (action.payload === "photo") state.type = "image";
    },
    success: (state, action) => {
      state.isOpen = initialValue.isOpen;
      state.type = initialValue.type;
      state.postText = initialValue.postText;
      state.background = initialValue.background;
      state.images = initialValue.images;
    },
  },
});
export const { type, images, background, postText, open, success } =
  createPostSlice.actions;

export default createPostSlice.reducer;
