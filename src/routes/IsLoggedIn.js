import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Loading from "../components/UI/Loading/Loading";
import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import { queryClient } from "../App";
import chat_notification from "../assets/chat_notification.wav";
import notification_sweet from "../assets/notification_sweet.wav";
import { setOnlineUsers } from "../app/slices/soketSlice";
import { toast } from "react-hot-toast";
import Notification from "../components/UI/Notification/Notification";
import { reciveNoti } from "../app/slices/userSlice";
import {
  updateChatName,
  updateChatTheme,
  updateMessages,
  updateSeenMessages,
} from "../utils/rqUpdate";

export let socket;

function playNotificationSound() {
  const audio = new Audio(chat_notification);
  audio.play();
}

function playNotificationSound2() {
  const audio = new Audio(notification_sweet);
  audio.play();
}

export default function IsLoggedIn({ user }) {
  const dispatch = useDispatch();

  const msgNoti = (newMessage) => {
    const res = window.location.pathname.split("/").pop() !== newMessage.chat;
    return res;
  };

  useEffect(() => {
    if (user.userinfo) {
      socket = io(process.env.REACT_APP_BACKEND_URL);
      socket.emit("setup", {
        userId: user.userinfo._id,
        info: {
          id: user.userinfo._id,
          username: user.userinfo.username,
          first_name: user.userinfo.first_name,
          last_name: user.userinfo.last_name,
          photo: user.userinfo.photo,
        },
      });

      socket.on("online_user", ({ type, info }) => {
        dispatch(setOnlineUsers({ type, info }));
      });

      socket.on("new_notification", ({ notification }) => {
        playNotificationSound2();
        dispatch(
          reciveNoti({
            type: "notification",
          })
        );

        toast.custom((t) => (
          <Notification t={t} toast={toast} notification={notification} />
        ));

        queryClient.setQueryData(["getNotifications"], (oldData) => {
          if (!oldData) return oldData;
          let newData = oldData;
          newData.data.notifications = [
            notification,
            ...newData.data.notifications,
          ];
          return {
            ...oldData,
            newData,
          };
        });
      });

      socket.on("message_recieved", (newMessage) => {
        playNotificationSound();
        dispatch(
          reciveNoti({
            type: "message",
          })
        );
        if (msgNoti(newMessage)) {
          toast.custom((t) => (
            <Notification
              t={t}
              toast={toast}
              notification={{
                sender: newMessage.sender,
                type: "message",
                click: `/messages/${newMessage.chat}`,
                content: `${newMessage.sender.first_name} ${newMessage.sender.last_name} sent you a message`,
                createdAt: newMessage.createdAt,
              }}
            />
          ));
        }
        updateMessages(newMessage);
      });

      socket.on("customize_chat", ({ type, content, chat }) => {
        if (type === "theme") {
          updateChatTheme(content, chat);
        }
        if (type === "name") {
          updateChatName(content, chat);
        }
      });

      socket.on("seen", ({ message: newMessage, chat }) => {
        updateSeenMessages(newMessage, chat);
      });
    }
  }, []);

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
