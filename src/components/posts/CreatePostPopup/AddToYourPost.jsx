import React from "react";
import { Dots, Feeling, Photo } from "../../../svg";
import classes from "./CreatePostPopup.module.css";
import { useDispatch } from "react-redux";
import * as createPostSlice from "../../../app/slices/createPostSlice";

function AddToYourPost() {
  const dispatch = useDispatch();

  return (
    <div className={classes.add_to}>
      <div className={classes.addto_text}>Add to your post</div>
      <div className={classes.icons}>
        <div
          className="hover1"
          onClick={() => dispatch(createPostSlice.type("image"))}
        >
          <Photo color="#45bd62" />
        </div>
        <div className="hover1">
          <i className="tag_icon"></i>
        </div>
        <div className="hover1">
          <Feeling color="#f7b928" />
        </div>
        <div className="hover1">
          <i className="maps_icon"></i>
        </div>
        <div className="hover1">
          <Dots color="#65676b" />
        </div>
      </div>
    </div>
  );
}

export default AddToYourPost;
