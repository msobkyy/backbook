import React from "react";
import styles from "./messages.module.css";
import { useParams } from "react-router-dom";
import Middle from "./Middle";
import Left from "./Left";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import { useEffect } from "react";
import Lottie from "react-lottie-player";
import homeDesk from "../../components/UI/Lottie/messages.json";
import { setSelectedChat } from "../../app/slices/soketSlice";

function Messages() {
  const { soketSlice, user: userState } = useSelector((state) => ({
    ...state,
  }));
  const dispatch = useDispatch();

  const user = userState.userinfo;
  const { chatId } = useParams();
  const desktopView = useMediaQuery({
    query: "(min-width: 850px)",
  });

  const pView = desktopView || !chatId;

  const [openInfo, setOpenInfo] = useState(pView);

  useEffect(() => {
    setOpenInfo(pView);
  }, [pView]);

  useEffect(() => {
    dispatch(setSelectedChat(chatId));
  }, [chatId]);

  useEffect(() => {
    const appHeight = (e) => {
      const doc = document.documentElement;
      const h = window.visualViewport.height;
      doc.style.setProperty("--app-height", `${h}px`);
    };
    window.addEventListener("resize", appHeight);
    appHeight();

    return () => {
      window.addEventListener("resize", appHeight);
    };
  }, []);

  return (
    <div
      className={`${styles.main} ${!openInfo ? styles.main_info : ""} ${
        !chatId ? styles.main_info : ""
      }`}
    >
      {pView && <Left chatId={chatId} soketSlice={soketSlice} user={user} />}
      {chatId ? (
        <Middle
          pView={pView}
          chatId={chatId}
          soketSlice={soketSlice}
          user={user}
          setOpenInfo={setOpenInfo}
          openInfo={openInfo}
        />
      ) : (
        <div className={styles.home_desk}>
          <Lottie
            style={{
              transform: "translateY(2px)",
              height: 250,
            }}
            animationData={homeDesk}
            loop
            play
          />
          <h2>Start a conversation</h2>
        </div>
      )}
    </div>
  );
}

export default Messages;
