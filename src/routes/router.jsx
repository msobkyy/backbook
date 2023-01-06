import { Route, Routes } from "react-router-dom";
import IsLoggedIn from "./IsLoggedIn";
import NotLoggedIn from "./NotLoggedIn";
import pagesData from "./pagesData";

const Router = () => {
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
      <Route element={<IsLoggedIn />}> {pageRoutesPriv}</Route>
      <Route element={<NotLoggedIn />}> {pageRoutes}</Route>
      <Route path="*" element={<p>Error 404 Not found</p>} />
    </Routes>
  );
};

export default Router;
