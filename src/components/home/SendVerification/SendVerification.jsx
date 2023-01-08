import React from "react";
import Card from "../../UI/Card/Card";
import styles from "./SendVerification.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Lottie from "react-lottie-player";
import successAnimation from "../../UI/Lottie/success.json";
import BarLoader from "react-spinners/BarLoader";

function SendVerification() {
  const enabled = false;
  const { fetchStatus, status, error, data, refetch } = useQuery({
    queryKey: ["resendEmail"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/resendEmailVerifivation`,
        {},
        {
          withCredentials: true,
        }
      );
      return data;
    },
    enabled,
    retry: false,
  });

  const resendEmail = () => {
    refetch();
  };

  if (data?.status === "success")
    return (
      <Card className={styles.done}>
        <p className="text_success">Email verification sent successfully</p>

        <Lottie
          style={{
            width: 20,
            height: 20,
            transform: "translateY(2px)",
          }}
          animationData={successAnimation}
          play
          loop={false}
        />
      </Card>
    );

  if (fetchStatus === "fetching" && status === "loading")
    return (
      <Card className={styles.done}>
        <BarLoader
          color="#1876f2"
          size={20}
          width="100%"
          loading={fetchStatus === "fetching" && status === "loading"}
        />
      </Card>
    );

  return (
    <Card className={styles.ActiveAccount}>
      <span>
        Your account is not verified, verify your account to avoid deleting Your
        acccount.
      </span>
      <div className={styles.link} onClick={resendEmail}>
        Resend email verification
      </div>
      {error ? (
        <p className="text_error">{error.response?.data?.message}</p>
      ) : (
        ""
      )}
    </Card>
  );
}

export default SendVerification;
