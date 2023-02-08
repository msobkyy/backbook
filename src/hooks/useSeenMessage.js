import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "../routes/IsLoggedIn";
import { useDispatch } from "react-redux";
import { updateNStats } from "../app/slices/userSlice";
import { updateSeenMessages } from "../utils/rqUpdate";

const SeenMessage = async ({ messageId }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/messages/${messageId}/seen`,
    {},
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useSeenMessage = (chat) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: "useSeenMessage",
    mutationFn: SeenMessage,
    onSuccess: (data) => {
      const newMessage = data?.data?.message;
      const unseenMessages = data?.data?.unseenMessages;

      updateSeenMessages(newMessage, chat);

      dispatch(
        updateNStats({
          unseenMessages,
        })
      );

      socket.emit("seen", { message: newMessage, chat });
    },
  });
};
