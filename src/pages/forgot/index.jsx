import React, { useState } from "react";
import ChangePassword from "../../components/forgot/ChangePassword";
import CodeVerification from "../../components/forgot/CodeVerification";
import SearchAccount from "../../components/forgot/SearchAccount";
import SendEmail from "../../components/forgot/SendEmail";
import LoginFooter from "../../components/login/LoginFooter";
import NoAuthHeader from "../../components/noAuthHeader";
import styles from "./style.module.css";

function Forgot() {
  const [visible, setVisible] = useState(0);
  const [userInfos, setUserInfos] = useState("");

  return (
    <div className="forgot">
      <NoAuthHeader />
      <div className={styles.wrapper}>
        {visible === 0 && (
          <SearchAccount setVisible={setVisible} setUserInfos={setUserInfos} />
        )}
        {visible === 1 && (
          <SendEmail setVisible={setVisible} userInfos={userInfos} />
        )}
        {visible === 2 && (
          <CodeVerification
            setVisible={setVisible}
            setUserInfos={setUserInfos}
            userInfos={userInfos}
          />
        )}
        {visible === 3 && (
          <ChangePassword
            setVisible={setVisible}
            setUserInfos={setUserInfos}
            userInfos={userInfos}
          />
        )}
      </div>
      <LoginFooter />
    </div>
  );
}

export default Forgot;
