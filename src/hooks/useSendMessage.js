import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { socket } from "../routes/IsLoggedIn";
import { updateMessages } from "../utils/rqUpdate";

export const useSendMessage = (chat) => {
  const user = useSelector((state) => ({ ...state.user.userinfo }));

  return useMutation({
    mutationKey: "useSendMessage",
    mutationFn: async ({ content, chatId, type }) => {
      updateMessages({
        _id: Math.floor(Math.random() * 100000000000 + 1),
        content,
        chat: chatId,
        type,
        sender: user,
      });

      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/messages/${chatId}/send`,
        { content, type },
        {
          withCredentials: true,
        }
      );
      return data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
    onSuccess: (data) => {
      const newMessage = data?.data?.message;

      socket.emit("new_message", { message: newMessage, chat });
    },
  });
};
