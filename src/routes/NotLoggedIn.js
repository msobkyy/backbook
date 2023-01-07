import React from "react";

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/UI/Loading/Loading";

export default function NotLoggedIn() {
  const { user } = useSelector((state) => ({ ...state }));
  return user.userinfo ? (
    <Navigate to="/" />
  ) : (
    <React.Suspense fallback={<Loading />}>
      <Outlet />
    </React.Suspense>
  );
}
