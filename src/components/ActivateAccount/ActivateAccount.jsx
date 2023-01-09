import React from "react";
import Portal from "../../utils/Portal";
import Card from "../UI/Card/Card";
import styles from "./ActivateAccount.module.css";
import BarLoader from "react-spinners/BarLoader";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Lottie from "react-lottie-player";
import errorAnimation from "../UI/Lottie/error.json";
import successAnimation from "../UI/Lottie/success.json";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../app/slices/userSlice";

function ActivateAccount({ token }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, error, data } = useQuery({
    queryKey: ["activate"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/emailVerification`,
        {
          token,
        },
        {
          withCredentials: true,
        }
      );
      return data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (data?.status === "success") {
    setTimeout(() => {
      dispatch(login(data));
    }, 3500);
  }
  if (error) {
    setTimeout(() => {
      navigate("/");
    }, 3500);
  }

  return (
    <Portal>
      <div className="blur">
        <Card className={styles.card}>
          <div className={styles.header}>Activating Your Account</div>
          <div className={styles.body}>
            {isLoading ? (
              <BarLoader
                color="#1876f2"
                size={20}
                width="100%"
                loading={isLoading}
              />
            ) : (
              ""
            )}
            {error && (
              <div>
                <Lottie
                  style={{
                    width: 100,
                    height: 80,
                    margin: "auto",
                  }}
                  animationData={errorAnimation}
                  play
                  loop={false}
                />
                <p className="text_error">{error.response?.data?.message}</p>
              </div>
            )}
            {data?.status === "success" && (
              <div>
                <Lottie
                  style={{
                    width: 100,
                    height: 80,
                    margin: "auto",
                  }}
                  animationData={successAnimation}
                  play
                  loop={false}
                />
                <p className="text_success">
                  Your account activated succesfully
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Portal>
  );
}

export default ActivateAccount;
