import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "../routes/IsLoggedIn";

const AddReact = async ({ post, type }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/${post}/reacts`,
    { type },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useReaction = () => {
  return useMutation({
    mutationKey: "useReaction",
    mutationFn: AddReact,
    onSuccess: (data) => {
      const newNotification = data?.data?.newNotification;
      if (newNotification) {
        socket.emit("notification", { notification: newNotification });
      }
    },
  });
};
