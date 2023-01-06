import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const DeletePost = async ({ post }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/${post}`,
    {},
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useDeletePost = (post) => {
  return useMutation({
    mutationKey: ["useDeletePost", post],
    mutationFn: DeletePost,
  });
};
