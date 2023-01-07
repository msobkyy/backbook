import React from "react";
import classes from "./Loading.module.css";
import PuffLoader from "react-spinners/PuffLoader";

function Loading() {
  return (
    <div className={classes.main}>
      <PuffLoader color="#1876f2" />
    </div>
  );
}

export default Loading;
