import React, { useEffect } from "react";
import classes from "./style.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/posts/post";
import PostSkeleton from "../../components/skeleton/PostSkeleton";
import { useNavigate } from "react-router-dom";

function PostPage() {
  const navigate = useNavigate();

  const { post } = useParams();
  const { isLoading, isError, data, isFetching, isSuccess } = useQuery({
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

  const postsSkelton = isLoading || isFetching;

  useEffect(() => {
    if (isError) {
      navigate("/404");
    }
  }, [isError]);

  return (
    <div className={classes.post}>
      <div className={classes.container}>
        {postsSkelton && <PostSkeleton />}
        {isSuccess && !isLoading && <Post post={data?.data.post} />}
      </div>
    </div>
  );
}

export default PostPage;
