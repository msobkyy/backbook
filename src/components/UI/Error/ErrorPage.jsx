import React from "react";
import classes from "./ErrorPage.module.css";
import e404Animation from "../../UI/Lottie/404.json";
import Lottie from "react-lottie-player";
import { useNavigate } from "react-router-dom";

function ErrorPage({ error }) {
  const navigate = useNavigate();

  return (
    <div className={classes.main}>
      <Lottie
        style={{
          transform: "translateY(2px)",
          width: 300,
          height: 300,
        }}
        animationData={e404Animation}
        loop
        play
      />
      <p>Something Went Wrong</p>
      <div
        className="btn_blue"
        style={{ maxWidth: "300px" }}
        onClick={() => {
          navigate("/");
        }}
      >
        Go to home
      </div>
    </div>
  );
}

export default ErrorPage;
