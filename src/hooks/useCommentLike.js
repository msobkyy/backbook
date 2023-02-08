import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "../routes/IsLoggedIn";

const AddCommentLike = async ({ comment }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/comments/${comment}/like`,
    {},
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useCommentLike = (comment) => {
  return useMutation({
    mutationKey: ["useCommentLike", comment],
    mutationFn: AddCommentLike,
    onSuccess: (data) => {
      const newNotification = data?.data?.newNotification;
      if (newNotification) {
        socket.emit("notification", { notification: newNotification });
      }
    },
  });
};
