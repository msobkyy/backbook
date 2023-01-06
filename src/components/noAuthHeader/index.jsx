import React from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import { Logo } from "../../svg";

function NoAuthHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <div className={styles.circle}>
          <Logo width={200} />
        </div>
      </Link>
      <Link to="/login" className={styles.login}>
        <button className="btn_blue">log In</button>
      </Link>
    </header>
  );
}

export default NoAuthHeader;
