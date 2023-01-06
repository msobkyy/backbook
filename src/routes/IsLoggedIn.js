import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function IsLoggedIn() {
  const { user } = useSelector((state) => ({ ...state }));
  return user.userinfo ? <Outlet /> : <Navigate to="/login" />;
}
