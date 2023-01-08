import { useState } from "react";
import Card from "../UI/Card/Card";
import styles from "./style.module.css";
import axios from "axios";
import FormLoader from "../FormLoader";

function SendEmail({ setVisible, userInfos }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/forgotPassword`,
        {
          email: userInfos.email,
        },
        {
          withCredentials: true,
        }
      );
      setError("");
      setLoading(false);
      setVisible(2);
    } catch (error) {
      setError(error.response?.data?.message);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <Card className={styles.wrap}>
      <div className={styles.header}>Reset Your Password</div>
      {error ? (
        <div className={styles.error}>
          <div className={styles.error_header}>Error</div>
          <span>{error}</span>
        </div>
      ) : (
        ""
      )}

      <FormLoader loading={loading}>
        <div className={styles.s_content}>
          <div className={styles.s_left}>
            <span className={styles.s_left_text}>
              How do you want to receive the code to reset your password?
            </span>
            <label htmlFor="email" className="hover1">
              <input type="radio" name="" id="email" checked readOnly />
              <div className={styles.label_col}>
                <span>Send code via email</span>
                <span>{userInfos.email}</span>
              </div>
            </label>
          </div>
          <div className={styles.s_right}>
            <img src={userInfos.photo} alt="" />
            <span>{userInfos.email}</span>
            <span>{userInfos.first_name}</span>
          </div>
        </div>
      </FormLoader>
      <div className={styles.btns}>
        <button className="gray_btn" onClick={() => setVisible(0)}>
          Not You?
        </button>
        <button className="btn_blue" onClick={submitHandler}>
          Continue
        </button>
      </div>
    </Card>
  );
}

export default SendEmail;
