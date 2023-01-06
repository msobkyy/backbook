import React from "react";
import { Feeling, LiveVideo, Photo } from "../../../../svg";
import styles from "./CreatePost.module.css";
import * as createPostSlice from "../../../../app/slices/createPostSlice";
import { useSelector, useDispatch } from "react-redux";

function CreatePost({ user, profile }) {
  const dispatch = useDispatch();
  const createPost = useSelector((state) => state.createPost);

  return (
    <div className={styles.create_post}>
      <div className={styles.header}>
        <img src={user?.photo} alt="" />
        <div
          className={`${styles.open_post} hover2`}
          onClick={() => {
            dispatch(createPostSlice.open());
          }}
        >
          {createPost.postText
            ? createPost.postText
            : ` What's on your mind, ${user?.first_name}`}
        </div>
      </div>
      <div className={styles.splitter} />
      <div className={styles.post_body}>
        <div className={`${styles.createPost_icon} hover1`}>
          <LiveVideo color="#f3425f" />
          Live Video
        </div>

        <div
          className={`${styles.createPost_icon} hover1`}
          onClick={() => {
            dispatch(createPostSlice.open("photo"));
          }}
        >
          <Photo color="#4bbf67" />
          Photo/Video
        </div>
        {profile ? (
          <div className="createPost_icon hover1">
            <i className="lifeEvent_icon"></i>
            Life Event
          </div>
        ) : (
          <div className={`${styles.createPost_icon} hover1`}>
            <Feeling color="#f7b928" />
            Feeling/Activity
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
