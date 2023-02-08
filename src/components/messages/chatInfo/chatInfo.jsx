import React from "react";
import { useState } from "react";
import { ArrowDown1 } from "../../../svg";
import styles from "./chatInfo.module.css";

function ChatInfo({ title, children }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <div
        className={`${styles.main} hover2`}
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        <span>{title}</span>
        <div className={`${styles.icon} ${show ? styles.rotate360 : ""}`}>
          <ArrowDown1 />
        </div>
      </div>
      {show && <div className={styles.content}>{children}</div>}
    </>
  );
}

export default ChatInfo;
