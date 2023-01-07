import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { logout, updateRecivedRequestsCount } from "../app/slices/userSlice";
import Header from "../components/header/Header";
import Loading from "../components/UI/Loading/Loading";

export default function IsLoggedIn() {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const { refetch, error, data } = useQuery({
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

  if (user.userinfo) {
    refetch();
  }

  useEffect(() => {
    if (data) {
      dispatch(updateRecivedRequestsCount(data?.recivedRequestsCount));
    }
    if (error) {
      dispatch(logout());
    }
  }, [data, error]);

  return user.userinfo ? (
    <>
      <Header />
      <React.Suspense fallback={<Loading />}>
        <Outlet />
      </React.Suspense>
    </>
  ) : (
    <Navigate to="/login" />
  );
}
