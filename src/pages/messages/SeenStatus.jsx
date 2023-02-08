import React from "react";
import { UnSeen } from "../../svg";
import styles from "./messages.module.css";

function SeenStatus({ chat, user }) {
  return (
    <>
      {chat?.latestMessage?.sender._id === user._id ? (
        chat?.latestMessage?.seen === "seen" ? (
          <img src={chat?.photo} alt="" className={styles.seen_status_s} />
        ) : (
          <span className={styles.seen_status_s}>
            <UnSeen />
          </span>
        )
      ) : chat?.latestMessage?.seen === "unseen" ? (
        <span className={styles.seen_status} />
      ) : (
        ""
      )}
    </>
  );
}

export default SeenStatus;
