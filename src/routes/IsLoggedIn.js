import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Loading from "../components/UI/Loading/Loading";

export default function IsLoggedIn() {
  const { user } = useSelector((state) => ({ ...state }));

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
