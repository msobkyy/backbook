import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../App";

const CreateChatGroup = async ({ users, chatName }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/chats/create/group`,
    { users, chatName },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useCreateChatGroup = () => {
  return useMutation({
    mutationKey: "useCreateChatGroup",
    mutationFn: CreateChatGroup,
    onSuccess: (data) => {
      const newChat = data?.data?.chat;

      queryClient.setQueryData(["getChats"], (oldData) => {
        if (!oldData) return oldData;
        let newData = oldData;
        newData.data.chats = [newChat, ...newData.data.chats];
        return {
          ...oldData,
          newData,
        };
      });
    },
  });
};
