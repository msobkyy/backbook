import { useEffect } from "react";
import Router from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreatePostPopup from "./components/posts/CreatePostPopup";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Portal from "./utils/Portal";

export const queryClient = new QueryClient();

function App() {
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const theme = useSelector((state) => state.user.theme);
  const createPost = useSelector((state) => state.createPost);

  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (createPost.isOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [createPost.isOpen]);

  return (
    <QueryClientProvider client={queryClient}>
      {createPost.isOpen && <CreatePostPopup user={user} />}
      <Portal>
        <Toaster position="bottom-left" reverseOrder={false} />
      </Portal>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
