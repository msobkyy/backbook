import React, { useRef } from "react";
import styles from "./ImagePreview.module.css";
import { useDispatch } from "react-redux";
import * as createPostSlice from "../../../app/slices/createPostSlice";

function ImagePreview({ images }) {
  const dispatch = useDispatch();
  const imgNum = images.length;
  const imageInputRef = useRef(null);

  const handleImages = (e) => {
    let files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("You can uplad onlay 5 images");
      return;
    }
    files.forEach((img) => {
      if (!img.type.startsWith("image")) return;
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (readerEvent) => {
        dispatch(createPostSlice.images(readerEvent.target.result));
      };
    });
  };
  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        hidden
        ref={imageInputRef}
        onChange={handleImages}
      />
      <div className={styles.wrap}>
        {images && images.length > 0 ? (
          <div className={`${styles.add} ${styles.images}`}>
            <div
              className={`${styles.exit} small_white_circle`}
              onClick={() => dispatch(createPostSlice.type("normal"))}
            >
              <i className="exit_icon"></i>
            </div>
            <div className={styles.preview_actions}>
              <button
                className="hover1"
                onClick={() => {
                  imageInputRef.current.click();
                }}
              >
                <i className="addPhoto_icon"></i>
                Add more photos
              </button>
            </div>
            <div
              className={`${styles.images_wrap} ${
                imgNum === 2
                  ? styles.per2
                  : imgNum === 3
                  ? styles.per3
                  : imgNum === 4
                  ? styles.per4
                  : imgNum === 5
                  ? styles.per5
                  : ""
              }`}
            >
              {images.map((img, i) => (
                <img src={img} alt={i} key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.add}>
            <div
              className={`${styles.exit} small_white_circle`}
              onClick={() => dispatch(createPostSlice.type("normal"))}
            >
              <i className="exit_icon"></i>
            </div>
            <div
              className={styles.add_col}
              onClick={() => {
                imageInputRef.current.click();
              }}
            >
              <div className="small_circle hover1">
                <i className="addPhoto_icon"></i>
              </div>
              <span>Add Photos/Videos</span>
              <span>or drag and drop</span>
            </div>
          </div>
        )}
        <div className={styles.add_bottom}>
          <div className={styles.left}>
            <div className="small_circle">
              <i className="phone_icon"></i>
            </div>
            <span>Add photos from your mobile device</span>
          </div>
          <span
            className="gray_btn"
            onClick={() => {
              imageInputRef.current.click();
            }}
          >
            Add
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImagePreview;
