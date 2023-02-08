import React from "react";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import styles from "./Notification.module.css";

function Notification({ toast, t, notification }) {
  const navigate = useNavigate();
  return (
    <div className={`${styles.main}`}>
      <div className={styles.header}>
        <span>New notification</span>
        <div
          onClick={() => toast.dismiss(t.id)}
          className="small_circle"
          style={{
            width: "25px",
            height: "25px",
            margin: "0",
          }}
        >
          <i
            className="exit_icon"
            style={{
              transform: "scale(0.7)",
            }}
          ></i>
        </div>
      </div>
      <div
        className={styles.content}
        onClick={() => {
          toast.dismiss(t.id);
          navigate(notification.click);
        }}
      >
        <div className={styles.img}>
          <img src={notification?.sender?.photo} alt="" />
          <img
            className={styles.type}
            src={`../../../reacts/${
              notification.type === "react"
                ? notification.content.split(" ")[2]
                : notification.type
            }.svg`}
            alt=""
          />
        </div>
        <div className={styles.content_2}>
          <span>{notification.content}</span>
          <span className={styles.time}>
            <Moment fromNow interval={30}>
              {notification.createdAt}
            </Moment>
          </span>
        </div>
        <div>
          <p
            style={{
              background: `#0096ff`,
              width: "12px",
              height: "12px",
              borderRadius: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Notification;
