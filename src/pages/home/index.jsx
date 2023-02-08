import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HomeLeft from "../../components/home/left/HomeLeft";
import { useSelector, useDispatch } from "react-redux";
import HomeRight from "../../components/home/right/HomeRight";
import styles from "./style.module.css";
import Stories from "../../components/home/stories/Stories";
import CreatePost from "../../components/home/posts/CreatePost/CreatePost";
import ActivateAccount from "../../components/ActivateAccount/ActivateAccount";
import SendVerification from "../../components/home/SendVerification/SendVerification";
import { logout, updateNStats } from "../../app/slices/userSlice";

import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Post from "../../components/posts/post";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "../../components/skeleton/PostSkeleton";
import "../../fcm.js";
import { messaging } from "../../fcm";
import { getToken } from "firebase/messaging";
import { useAddFCM } from "../../hooks/useAddFCM";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const fcm = useSelector((state) => state.user.fcm);
  const { token } = useParams();
  const { ref, inView } = useInView();

  const { mutate } = useAddFCM();

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BJSPwo1aXb5un4sORg-jEcznSFs7QmuIhoFTNT6Se8Zje-r69aH5xxJAlFqDM9Y5SA3QJ5-1xiGfYOkADCT4dZs",
      });
      if (fcm !== token) {
        mutate({ fcm: token });
      }
    } else if (permission === "denied") {
      alert(
        "You denied for the notification access, please allow it to be able to recieve notifications"
      );
    }
  }

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
    refetchOnMount: false,
    staleTime: Infinity,
  });

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

  const postsSkeleton = isFetching || isLoading;

  const postsData = data || [];

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

  useEffect(() => {
    requestPermission();
    refetch();
  }, []);

  useEffect(() => {
    if (pingdata) {
      dispatch(
        updateNStats({
          recivedRequestsCount: pingdata?.recivedRequestsCount,
          unseenMessages: pingdata?.unseenMessages,
          unseenNotification: pingdata?.unseenNotification,
        })
      );
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
            <div className={styles.posts}>
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : hasNextPage ? (
            "Loading Newer"
          ) : (
            "You have reached the end"
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
