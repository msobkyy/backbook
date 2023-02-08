import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "../components/UI/Error/ErrorPage";
import IsLoggedIn from "./IsLoggedIn";
import NotLoggedIn from "./NotLoggedIn";
import pagesData from "./pagesData";

const Router = () => {
  const { soketSlice, user } = useSelector((state) => ({ ...state }));

  const pageRoutes = pagesData
    .filter(({ priv }) => !priv)
    .map(({ path, title, element }) => {
      return <Route key={title} path={`/${path}`} element={element} exact />;
    });

  const pageRoutesPriv = pagesData
    .filter(({ priv }) => priv)
    .map(({ path, title, element }) => {
      return <Route key={title} path={`/${path}`} element={element} exact />;
    });

  return (
    <Routes>
      <Route element={<IsLoggedIn user={user} />}>{pageRoutesPriv}</Route>
      <Route element={<NotLoggedIn user={user} />}> {pageRoutes}</Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
