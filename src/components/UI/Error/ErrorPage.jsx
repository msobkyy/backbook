import React from "react";
import classes from "./ErrorPage.module.css";
import e404Animation from "../../UI/Lottie/404.json";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";

const e404Options = {
  loop: true,
  autoplay: true,
  animationData: e404Animation,
};

function ErrorPage({ error }) {
  const navigate = useNavigate();

  return (
    <div className={classes.main}>
      <Lottie
        style={{
          transform: "translateY(2px)",
        }}
        options={e404Options}
        height={200}
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
