import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HomeLeft from "../../components/home/left/HomeLeft";
import { useSelector } from "react-redux";
import HomeRight from "../../components/home/right/HomeRight";
import styles from "./style.module.css";
import Stories from "../../components/home/stories/Stories";
import CreatePost from "../../components/home/posts/CreatePost/CreatePost";
import ActivateAccount from "../../components/ActivateAccount/ActivateAccount";
import SendVerification from "../../components/home/SendVerification/SendVerification";
import { logout, updateRecivedRequestsCount } from "../app/slices/userSlice";

import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "../../components/posts/post";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "../../components/skeleton/PostSkeleton";

function Home() {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const fetchPosts = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/getAllPosts?sort=-createdAt&limit=10&page=${pageParam}`,
      {
        withCredentials: true,
      }
    );
    return data;
  };

  const {
    isLoading,
    error,
    isSuccess,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allPosts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) {
        return undefined;
      } else {
        return pages.length + 1;
      }
    },
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 2000,
  });

  const postsSkeleton = isFetching || isLoading;

  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const { token } = useParams();

  useEffect(() => {
    if (token && user.verified) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const postsData = data || [];

  const dispatch = useDispatch();

  const {
    refetch,
    error: pingError,
    data: pingdata,
  } = useQuery({
    queryKey: ["ping"],
    queryFn: async () => {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/ping`,
        {},
        {
          withCredentials: true,
        }
      );
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: false,
    retry: false,
    cacheTime: 0,
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (pingdata) {
      dispatch(updateRecivedRequestsCount(data?.recivedRequestsCount));
    }
    if (pingError) {
      dispatch(logout());
    }
  }, [data, error]);

  return (
    <div className={styles.home}>
      <HomeLeft user={user} />
      <HomeRight user={user} />
      <div className={styles.home_middle}>
        <Stories />
        {token && !user.verified && <ActivateAccount token={token} />}
        {!user.verified && <SendVerification />}
        <CreatePost user={user} />
        <div className={styles.posts}>
          {postsSkeleton && (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}
          {isSuccess &&
            !isLoading &&
            !error &&
            postsData &&
            data.pages.map &&
            data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.data.map((post) => (
                  <React.Fragment key={post._id}>
                    <Post post={post} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
        </div>
        <div
          ref={ref}
          disabled={!hasNextPage || isFetchingNextPage}
          style={{ marginBottom: "20px" }}
        >
          {isFetchingNextPage ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : hasNextPage ? (
            "Load Newer"
          ) : (
            ".."
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
