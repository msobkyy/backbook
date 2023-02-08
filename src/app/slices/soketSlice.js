import { createSlice } from "@reduxjs/toolkit";

// type = ['normal','image','background']

const initialValue = {
  onlineUsers: [],
  selectedChat: null,
};
export const createSoketSlice = createSlice({
  name: "soketSlice",
  initialState: initialValue,

  reducers: {
    setOnlineUsers: (state, action) => {
      const { type, info } = action.payload;
      if (
        type === "add" &&
        !state.onlineUsers.find((u) => u?.id === info?.id)
      ) {
        state.onlineUsers = [...state.onlineUsers, info];
      } else if (type === "remove") {
        state.onlineUsers = state.onlineUsers.filter((u) => u?.id !== info?.id);
      } else if (type === "connect") {
        state.onlineUsers = info;
      }
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});
export const { setOnlineUsers, setSelectedChat } = createSoketSlice.actions;

export default createSoketSlice.reducer;
