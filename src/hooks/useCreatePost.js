import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "./../App";

const CreatePost = async ({ data, type }) => {
  const reqdata = axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/createPost${
      type === "image" ? "/images" : ""
    }`,
    data,
    {
      withCredentials: true,
    }
  );
  return reqdata;
};

export const useCreatePost = (usernameID) => {
  return useMutation({
    mutationKey: "useCreatePost",
    mutationFn: CreatePost,
    onSuccess: (data) => {
      queryClient.setQueryData(["getProfilePosts", usernameID], (oldData) => {
        if (!oldData) return;

        let newData = oldData;
        const newPost = data.data.data;
        newData.pages[0].data = [newPost, ...newData.pages[0].data];
        return {
          ...oldData,
          newData,
        };
      });

      queryClient.setQueryData(["allPosts"], (oldData) => {
        if (!oldData) return oldData;

        let newData = oldData;
        const newPost = data.data.data;
        newData.pages[0].data = [newPost, ...newData?.pages[0]?.data];
        return {
          ...oldData,
          newData,
        };
      });
    },
  });
};
