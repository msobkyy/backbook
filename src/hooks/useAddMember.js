import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../App";
import { useSendMessage } from "./useSendMessage";

const AddMember = async ({ chatId, userId }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/chats/group/add`,
    { chatId, userId },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useAddMember = (chat) => {
  const { mutate: sendMessage } = useSendMessage(chat);

  return useMutation({
    mutationKey: "useAddMember",
    mutationFn: AddMember,
    onSuccess: (data) => {
      const user = data?.data?.user;

      queryClient.setQueryData(["getMessages", chat._id], (oldData) => {
        if (!oldData) return oldData;
        let newData = oldData;
        newData.pages[0].data.chat.users = [
          user,
          ...newData.pages[0].data.chat.users,
        ];

        return {
          ...oldData,
          newData,
        };
      });

      sendMessage({
        content: `${user.first_name} ${user.last_name} Added to this group`,
        type: "info",
        chatId: chat._id,
      });
    },
  });
};
