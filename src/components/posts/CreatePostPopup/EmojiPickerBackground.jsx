import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import classes from "./CreatePostPopup.module.css";
import Portal from "../../../utils/Portal";
import { usePopper } from "react-popper";
import { ScrollContainer } from "react-indiana-drag-scroll";
import "react-indiana-drag-scroll/dist/style.css";
import { useDispatch } from "react-redux";
import * as createPostSlice from "../../../app/slices/createPostSlice";

function EmojiPickerBackground({
  postTextRef,
  postText,
  setPostText,
  picker,
  setPicker,
  createPost,
  postBackgrounds,
}) {
  const dispatch = useDispatch();

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [cursorPosition, setCursorPosition] = useState();
  const [showBgs, setShowBgs] = useState(false);

  useEffect(() => {
    postTextRef.current.focus();
    postTextRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  useEffect(() => {
    postTextRef.current.focus();
  }, [picker]);

  const handleEmoji = ({ e, emoji }) => {
    const ref = postTextRef.current;
    ref.focus();
    const start = postText.substring(0, ref.selectionStart);
    const end = postText.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setPostText(newText);
    setCursorPosition(start.length + emoji.length);
  };

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
  return (
    <div className={classes.emoji_wrap} id="CreatePostPopup">
      {createPost.type === "image" ? (
        ""
      ) : (
        <div className={classes.background_wrap}>
          <img
            src="../../../icons/colorful.png"
            alt="colorful"
            className={classes.open_bg}
            onClick={() => {
              setShowBgs((prev) => !prev);
            }}
          />
          {showBgs && (
            <ScrollContainer className={classes.backgrounds}>
              <div
                className={classes.no_bg}
                onClick={() => {
                  dispatch(createPostSlice.type("normal"));
                }}
              ></div>
              {postBackgrounds.map((bg, i) => (
                <img
                  src={bg}
                  key={i}
                  alt={i}
                  onClick={() => {
                    dispatch(createPostSlice.background(i + 1));
                  }}
                />
              ))}
            </ScrollContainer>
          )}
        </div>
      )}
      <i
        onClick={() => {
          setPicker((prev) => !prev);
        }}
        className={`emoji_icon_large`}
        ref={setReferenceElement}
      ></i>
      {picker ? (
        <Portal id="CreatePostPopup">
          <div
            className={classes.emoji_picker}
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <EmojiPicker
              width={300}
              height={300}
              lazyLoadEmojis={true}
              onEmojiClick={handleEmoji}
              previewConfig={{ showPreview: false }}
            />
          </div>
        </Portal>
      ) : (
        ""
      )}
    </div>
  );
}

export default EmojiPickerBackground;
