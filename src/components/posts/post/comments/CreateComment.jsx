import React, { useState, useRef, useEffect } from "react";
import classes from "./CreateComment.module.css";
import { usePopper } from "react-popper";
import Portal from "../../../../utils/Portal";
import EmojiPicker from "emoji-picker-react";
import useOnClickOutside from "../../../../hooks/useOnClickOutside";
import { useComment } from "../../../../hooks/useComment";
import FormLoader from "../../../FormLoader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function CreateComment({
  commentRef,
  post,
  commentCountHandler,
  setLastCommentData,
  placholdertxt,
  type,
  setReplies,
  setCount,
}) {
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [picker, setPicker] = useState(false);
  const [commentImage, setCommentImage] = useState("");

  const [cursorPosition, setCursorPosition] = useState();
  const [commentText, setCommentText] = useState("");
  const pickerRef = useRef();
  const imgInput = useRef(null);

  useOnClickOutside(pickerRef, picker, () => {
    setPicker(false);
  });

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const handleEmoji = ({ e, emoji }) => {
    const ref = commentRef.current;
    ref.focus();
    const start = commentText.substring(0, ref.selectionStart);
    const end = commentText.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setCommentText(newText);
    setCursorPosition(start.length + emoji.length);
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCommentImage(event.target.result);
    };
  };
  const {
    mutate: addComment,
    data: commendData,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useComment();

  const commentHandler = async (e) => {
    e.preventDefault();
    let form = new FormData();
    if (commentImage) {
      let blob = await fetch(commentImage).then((r) => r.blob());
      form.append("photo", blob);
    }
    form.append("text", commentText);

    addComment({ form, post, type });
  };

  useEffect(() => {
    if (commendData?.status === "success") {
      setCommentImage("");
      setCommentText("");
      if (type === "reply") {
        setReplies(commendData.data.replies);
        setCount(commendData.data.replies.length);
      } else {
        setLastCommentData(commendData.data.commendData);
        commentCountHandler(commendData.data.commentsCount);
      }
    }
  }, [commendData, isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data.message || "Something went wrong");
    }
  }, [isError]);

  return (
    <FormLoader loading={isLoading} type={2}>
      <div className={classes.wrap}>
        <div className={classes.left}>
          <img src={user.photo} alt="" />
        </div>
        <div className={classes.right}>
          <div id="CreateComment" className={classes.input}>
            <form className={classes.input} onSubmit={commentHandler}>
              <input
                type="file"
                hidden
                ref={imgInput}
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImage}
              />
              <input
                placeholder={placholdertxt}
                type="text"
                ref={commentRef}
                onChange={(e) => {
                  setCommentText(e.target.value);
                }}
                value={commentText}
              />
            </form>
          </div>
          <div className={classes.emoji_wrap}>
            {picker ? (
              <Portal id="CreateComment">
                <div
                  className={classes.emoji_picker}
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  <div ref={pickerRef}>
                    <EmojiPicker
                      width={300}
                      height={300}
                      lazyLoadEmojis={true}
                      onEmojiClick={handleEmoji}
                      previewConfig={{ showPreview: false }}
                      searchDisabled={true}
                    />
                  </div>
                </div>
              </Portal>
            ) : (
              ""
            )}
            <div
              className={classes.camera}
              onClick={() => imgInput.current.click()}
            >
              <i className="camera_icon"></i>
            </div>
            <div
              className={classes.emoji}
              onClick={() => {
                setPicker((prev) => !prev);
              }}
              ref={setReferenceElement}
            >
              <i className={`emoji_icon_large`}></i>
            </div>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className={classes.img_perview}>
          <img src={commentImage} alt="" />
          <div className={classes.exit} onClick={() => setCommentImage("")}>
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </FormLoader>
  );
}

export default CreateComment;
