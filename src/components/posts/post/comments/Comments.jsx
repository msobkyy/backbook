import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import classes from "./Comments.module.css";
import axios from "axios";
import Comment from "./Comment";

function Comments({
  lastComment,
  commentsCount,
  postID,
  lastCommentData,
  commentRef,
}) {
  const [comments, setComments] = useState([]);

  const fetchProjects = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/comments/${postID}?limit=4&page=${pageParam}&sort=-createdAt`,
      {
        withCredentials: true,
      }
    );
    return data;
  };

  const { fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["comments", postID],
    queryFn: fetchProjects,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.datalength < 4) {
        return undefined;
      } else {
        return pages.length + 1;
      }
    },
    onSuccess: (data) => {
      const newCommemnts = data.pages[data.pages.length - 1].data.comments;
      if (data.pages.length === 1) {
        setComments([...newCommemnts]);
      } else {
        setComments((prev) => [...prev, ...newCommemnts]);
      }
    },
    enabled: false,
  });

  const viewMoreHandler = () => {
    fetchNextPage();
  };

  useEffect(() => {
    if (lastComment) {
      setComments((prev) => [...prev, lastComment]);
    }
  }, []);

  useEffect(() => {
    if (lastCommentData) setComments((prev) => [lastCommentData, ...prev]);
  }, [lastCommentData]);

  return (
    <div className={classes.comments_wrap}>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
      {commentsCount > comments.length ? (
        <>
          <div className={classes.view_more} onClick={viewMoreHandler}>
            View more comments
            {isFetching && " Loading..."}
          </div>
        </>
      ) : (
        <>
          <div
            className={classes.view_more}
            onClick={() => {
              commentRef.current.focus();
            }}
          >
            Write a comment...
          </div>
        </>
      )}
    </div>
  );
}

export default Comments;
