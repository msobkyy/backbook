import React, { useState, useEffect, useRef } from "react";
import { useCreatePost } from "../../../../hooks/useCreatePost";
import isRTL from "../../../../utils/isRTL";
import Portal from "../../../../utils/Portal";
import FormLoader from "../../../FormLoader";
import Card from "../../../UI/Card/Card";
import classes from "./CreateSharePost.module.css";
import SharedPost from "./SharedPost";
import toast from "react-hot-toast";
import useOnClickOutside from "../../../../hooks/useOnClickOutside";

function CreateSharePost({
  showSharePost,
  setShowSharePost,
  post,
  setSharesCount,
}) {
  const [description, setDescription] = useState("");
  const createShareRef = useRef();

  const { data, isLoading, isSuccess, mutate } = useCreatePost();

  useOnClickOutside(createShareRef, showSharePost, () => {
    setShowSharePost(false);
  });

  const sharePostHandler = () => {
    let form = new FormData();
    form.append("type", "share");
    form.append("text", description);
    form.append("sharedID", post._id);
    mutate({ data: Object.fromEntries(form), type: "share" });
  };

  useEffect(() => {
    if (isSuccess && data?.data?.status === "success") {
      setTimeout(() => {
        setShowSharePost(false);
        setSharesCount((perv) => perv + 1);
        toast.success("Successfully Shared!");
      }, 300);
    }
  }, [data, isSuccess]);
  return (
    <Portal>
      <div className={`${classes.wrap} blur`}>
        <Card className={classes.card} innerRef={createShareRef}>
          <div className={classes.header}>
            Share Post
            <div
              className="small_circle"
              onClick={() => setShowSharePost(false)}
            >
              <i className="exit_icon"></i>
            </div>
          </div>
          <div className={classes.content}>
            <FormLoader loading={isLoading}>
              <textarea
                style={{
                  fontSize: `${
                    description && description.length > 75 ? "15px" : ""
                  }`,
                  direction: `${isRTL(description) ? "rtl" : "ltr"}`,
                }}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={classes.textarea_blue}
              ></textarea>
              <SharedPost post={post} />
              <div className={classes.btns}>
                <button
                  className="gray_btn"
                  onClick={() => setShowSharePost(false)}
                >
                  Cancel
                </button>
                <button className="btn_blue" onClick={() => sharePostHandler()}>
                  Share
                </button>
              </div>
            </FormLoader>
          </div>
        </Card>
      </div>
    </Portal>
  );
}

export default CreateSharePost;
