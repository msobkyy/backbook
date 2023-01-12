import { useEffect } from "react";
import Router from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreatePostPopup from "./components/posts/CreatePostPopup";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Portal from "./utils/Portal";
import "./fcm.js";
import { messaging } from "./fcm";
import { getToken } from "firebase/messaging";

export const queryClient = new QueryClient();

function App() {
  async function requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BJSPwo1aXb5un4sORg-jEcznSFs7QmuIhoFTNT6Se8Zje-r69aH5xxJAlFqDM9Y5SA3QJ5-1xiGfYOkADCT4dZs",
      });
      console.log("Token Gen : ", token);
      prompt("Copy this token and send to server", token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const theme = useSelector((state) => state.user.theme);

  const createPost = useSelector((state) => state.createPost);

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
        <Toaster position="bottom-left" reverseOrder={true} />
      </Portal>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
