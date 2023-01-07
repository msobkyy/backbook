import React, { useState, useCallback, useEffect, useRef } from "react";
import classes from "../Post.module.css";
import Moment from "react-moment";
import { Public } from "../../../../svg";
import Card from "../../../UI/Card/Card";
import { postBackgrounds } from "../../../../data/post";
import ImageViewer from "react-simple-image-viewer";
import Portal from "../../../../utils/Portal";
import isRTL from "../../../../utils/isRTL";
import { Link } from "react-router-dom";

function SharedPost({ post }) {
  const imgNum = post.images.length;
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const postRef = useRef();
  const images = post.images;

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  useEffect(() => {
    if (isViewerOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [isViewerOpen]);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <Card className={classes.post} innerRef={postRef} style={{ width: "100%" }}>
      <div className={classes.body}>
        {post.type === "background" && (
          <div
            className={classes.background}
            style={{
              backgroundImage: `url(${postBackgrounds[post.background - 1]})`,
              marginTop: 0,
            }}
          >
            {post.text}
          </div>
        )}
        {post.type === "normal" && (
          <div
            className={classes.normal}
            style={{
              fontSize: `${post.text.length > 75 ? "15px" : ""}`,
              direction: `${isRTL(post.text) ? "rtl" : "ltr"}`,
            }}
          >
            {post.text}
          </div>
        )}
        {post.type === "image" && (
          <>
            <div
              className={`${classes.images_wrap} ${
                imgNum === 2
                  ? classes.per2
                  : imgNum === 3
                  ? classes.per3
                  : imgNum === 4
                  ? classes.per4
                  : imgNum === 5
                  ? classes.per5
                  : ""
              }`}
              style={{ marginTop: 0 }}
            >
              {post.images.map((img, i) => (
                <img
                  onClick={() => openImageViewer(i)}
                  src={img}
                  alt={i}
                  key={i}
                />
              ))}
            </div>
          </>
        )}
        {post.type === "profilePhoto" && (
          <>
            <div
              className={`${classes.profilePhoto_wrap} `}
              style={{ height: "370px" }}
            >
              <div
                className={classes.cover}
                style={{ backgroundImage: `url(${post.user.cover})` }}
              ></div>
              <img
                onClick={() => openImageViewer(0)}
                src={post.images[0]}
                alt={post.text}
                style={{ width: "280px" }}
              />
            </div>
          </>
        )}
        {post.type === "cover" && (
          <>
            <div className={`${classes.images_wrap} `}>
              <img
                onClick={() => openImageViewer(0)}
                src={post.images[0]}
                alt={post.text}
              />
            </div>
          </>
        )}
        <div className={classes.header} style={{ paddingBottom: "10px" }}>
          <div className={classes.left}>
            <Link to={`/profile/${post?.user?.username}`}>
              <img src={post.user.photo} alt="" style={{ width: "35px" }} />
            </Link>
          </div>
          <div className={classes.middle}>
            <div>
              <Link
                to={`/profile/${post?.user?.username}`}
                className={classes.username}
              >
                {`${post.user.first_name} ${post.user.last_name}`}
                {post.user?.confirmed && (
                  <i
                    style={{ marginLeft: "5px" }}
                    className="confirmed_comment_icon"
                  />
                )}
              </Link>

              {post.type === "profilePhoto" ? (
                <span className={classes.profilePhotoText}>
                  {`updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } profile
                picture`}
                </span>
              ) : post.type === "cover" ? (
                <span className={classes.profilePhotoText}>
                  {`updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } profile
            cover`}
                </span>
              ) : (
                ``
              )}
            </div>
            <Link
              className={classes.date}
              to={`/${post?.user?.username}/posts/${post?._id}`}
            >
              <Moment fromNow interval={30}>
                {post.createdAt}
              </Moment>
              <Public color="#828387" />
            </Link>
          </div>
          <div className={classes.right}></div>
        </div>
        {(post.type === "image" || post.type === "profilePhoto") && (
          <div
            className={classes.normal}
            style={{
              fontSize: `${post.text.length > 40 ? "15px" : ""}`,
              direction: `${isRTL(post.text) ? "rtl" : "ltr"}`,
            }}
          >
            {post.text}
          </div>
        )}
      </div>

      {isViewerOpen && (
        <Portal>
          <ImageViewer
            src={images}
            currentIndex={currentImage}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        </Portal>
      )}
    </Card>
  );
}

export default SharedPost;
