import React, { useState, useRef, useEffect } from "react";
import ImagePreviewStyles from "./ImagePreview.module.css";
import classes from "./CreatePostPopup.module.css";
import Portal from "../../../utils/Portal";
import Card from "../../UI/Card/Card";
import EmojiPickerBackground from "./EmojiPickerBackground";
import AddToYourPost from "./AddToYourPost";
import ImagePreview from "./ImagePreview";
import { useSelector, useDispatch } from "react-redux";
import * as createPostSlice from "../../../app/slices/createPostSlice";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import dataURItoBlob from "../../../utils/dataURItoBlob";
import FormLoader from "../../FormLoader";
import { postBackgrounds } from "../../../data/post";
import isRTL from "../../../utils/isRTL";
import { useCreatePost } from "../../../hooks/useCreatePost";

function CreatePostPopup({ user }) {
  const dispatch = useDispatch();

  const [picker, setPicker] = useState(false);
  const createPost = useSelector((state) => state.createPost);
  const postText = createPost.postText;
  const postImage = createPost.type === "image";
  const postNormal = createPost.type === "normal";
  const postBackground = createPost.type === "background";
  const postTextRef = useRef();
  const bgRef = useRef();
  const popUpRef = useRef(null);
  const setPostText = (txt) => {
    dispatch(createPostSlice.postText(txt.replace(/(^[ \t]*\n)/gm, "")));
  };

  useEffect(() => {
    if (postBackground) {
      bgRef.current.style.backgroundImage = `url(${
        postBackgrounds[createPost.background - 1]
      })`;
    } else {
      bgRef.current.style.backgroundImage = null;
    }
  }, [postBackground, createPost.background]);

  useOnClickOutside(popUpRef, createPost.isOpen, () => {
    dispatch(createPostSlice.open());
  });

  const { data, isLoading, isSuccess, error, mutate } = useCreatePost(
    user.username
  );

  useEffect(() => {
    if (isSuccess && data?.data?.status === "success") {
      setTimeout(() => {
        dispatch(createPostSlice.success());
      }, 300);
    }
  }, [data, isSuccess]);

  const postSubmit = () => {
    let form = new FormData();
    form.append("type", createPost.type);
    form.append("text", createPost.postText);
    if (createPost.type === "background")
      form.append("background", createPost.background);

    if (createPost.type === "image") {
      const postImages = createPost.images.map((img) => {
        return dataURItoBlob(img);
      });
      postImages.forEach((image) => {
        form.append("images", image);
      });
    }
    if (createPost.type === "image") {
      mutate({ data: form, type: "image" });
    } else {
      mutate({ data: Object.fromEntries(form), type: createPost.type });
    }
  };

  return (
    <Portal>
      <div className={`${classes.wrap} blur`}>
        <Card className={classes.card} innerRef={popUpRef}>
          <FormLoader loading={isLoading} isError={error}>
            <div className={classes.header}>
              <span>Create post</span>
              <div className={`${classes.exit} small_circle`}>
                <i
                  onClick={() => {
                    dispatch(createPostSlice.open());
                  }}
                  className="exit_icon"
                ></i>
              </div>
            </div>
            <div className={classes.profile}>
              <img src={user.photo} alt={user.name} className={classes.photo} />
              <div className={classes.profile_1}>
                <span className={classes.user_name}>
                  {`${user.first_name} ${user.last_name}`}{" "}
                </span>
                <div className={classes.privacy}>
                  <img src="../../../icons/public.png" alt="" />
                  <span>Public</span>
                  <i className="arrowDown_icon"></i>
                </div>
              </div>
            </div>

            <div className={classes.content}>
              <div
                className={classes.container}
                style={{ overflowY: postBackground ? "hidden" : "scroll" }}
              >
                <div
                  className={`${
                    postImage ? ImagePreviewStyles.header_wrapper : ""
                  }`}
                >
                  <div
                    ref={bgRef}
                    className={
                      postBackground ? classes.post_input_background : ""
                    }
                  >
                    <textarea
                      style={{
                        height: `${
                          postBackground ? `${postText.length * 1.1}px` : "auto"
                        }`,
                        fontSize: `${
                          postNormal && postText.length > 75 ? "15px" : ""
                        }`,
                        direction: `${isRTL(postText) ? "rtl" : "ltr"}`,
                      }}
                      ref={postTextRef}
                      placeholder={`What's on your mind, ${user?.first_name}?`}
                      className={`${classes.post_input}`}
                      maxLength={300}
                      onChange={(e) => {
                        setPostText(e.target.value);
                      }}
                      onClick={() => setPicker(false)}
                      value={postText}
                    ></textarea>
                  </div>
                  <EmojiPickerBackground
                    createPost={createPost}
                    postTextRef={postTextRef}
                    postText={postText}
                    setPostText={setPostText}
                    picker={picker}
                    setPicker={setPicker}
                    postBackgrounds={postBackgrounds}
                  />
                </div>
                {postImage && <ImagePreview images={createPost.images} />}
              </div>
              <div className={classes.cfooter}>
                <AddToYourPost />
                <button
                  disabled={isLoading}
                  className="btn_blue"
                  onClick={() => {
                    postSubmit();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </FormLoader>
        </Card>
      </div>
    </Portal>
  );
}

export default CreatePostPopup;
