import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "../routes/IsLoggedIn";

const AddComment = async ({ form, post, type }) => {
  const commentUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/AddComment/${post}`;
  const replyUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/comments/${post}/reply`;

  const { data } = await axios.post(
    type === "reply" ? replyUrl : commentUrl,
    form,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useComment = () => {
  return useMutation({
    mutationKey: "useComment",
    mutationFn: AddComment,
    onSuccess: (data) => {
      const newNotification = data?.data?.newNotification;
      if (newNotification) {
        socket.emit("notification", { notification: newNotification });
      }
    },
  });
};
