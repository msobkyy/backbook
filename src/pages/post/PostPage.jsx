import React from "react";
import Header from "../../components/header/Header";
import classes from "./style.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/posts/post";

function PostPage() {
  const { username, post } = useParams();
  const { isLoading, error, data, isFetching, isSuccess } = useQuery({
    queryKey: ["getPost", post],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/${post}`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
  return (
    <div className={classes.post}>
      <Header />
      <div className={classes.container}>
        {isSuccess && !isLoading && <Post post={data?.data.post} />}
      </div>
    </div>
  );
}

export default PostPage;
