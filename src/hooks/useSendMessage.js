import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { socket } from "../routes/IsLoggedIn";
import { updateMessages } from "../utils/rqUpdate";

const SendMessage = async ({ content, chatId, type }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/messages/${chatId}/send`,
    { content, type },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useSendMessage = (chat) => {
  return useMutation({
    mutationKey: "useSendMessage",
    mutationFn: SendMessage,
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
    onSuccess: (data) => {
      const newMessage = data?.data?.message;

      updateMessages(newMessage);

      socket.emit("new_message", { message: newMessage, chat });
    },
  });
};
