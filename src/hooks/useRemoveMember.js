import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../App";
import { useSendMessage } from "./useSendMessage";

const RemoveMember = async ({ chatId, userId }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/chats/group/remove`,
    { chatId, userId },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useRemoveMember = (chat) => {
  const { mutate: sendMessage } = useSendMessage(chat);

  return useMutation({
    mutationKey: "useRemoveMember",
    mutationFn: RemoveMember,
    onSuccess: (data) => {
      const userId = data?.data?.user;
      const deletedUser = data?.data?.deletedUser;

      queryClient.setQueryData(["getMessages", chat._id], (oldData) => {
        if (!oldData) return oldData;
        let newData = oldData;
        newData.pages[0].data.chat.users =
          newData.pages[0].data.chat.users.filter((m) => m._id !== userId);

        return {
          ...oldData,
          newData,
        };
      });

      sendMessage({
        content: `${deletedUser.first_name} ${deletedUser.last_name} Removed from this group`,
        type: "info",
        chatId: chat._id,
      });
    },
  });
};
