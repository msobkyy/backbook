import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import classes from "./Post.module.css";
import Moment from "react-moment";
import { Dots, Public } from "../../../svg";
import Card from "../../UI/Card/Card";
import { postBackgrounds } from "../../../data/post";
import ImageViewer from "react-simple-image-viewer";
import Portal from "../../../utils/Portal";
import ReactsPopup from "./likes/ReactsPopup";
import { usePopper } from "react-popper";
import CreateComment from "./comments/CreateComment";
import { useSelector } from "react-redux";
import isRTL from "../../../utils/isRTL";
import PostMenu from "./PostMenu";
import { Link } from "react-router-dom";
import { useReaction } from "../../../hooks/useReaction";
import Comments from "./comments/Comments";
import PostLikes from "./likes/PostLikes";
import SharedPost from "./shares/SharedPost";
import ShareMenu from "./shares/ShareMenu";

const getSortedReacts = (list) => {
  const reacts = Object.keys(
    Object.keys(list).reduce(function (r, e) {
      if (list[e] > 0) r[e] = list[e];
      return r;
    }, {})
  )
    .sort(function (a, b) {
      return list[b] - list[a];
    })
    .slice(0, 3);

  return reacts;
};

function Post({ post }) {
  const imgNum = post.images.length;
  const [lastCommentData, setLastCommentData] = useState();
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showReact, setShowReact] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [delayHandler, setDelayHandler] = useState(null);
  const [reactions, setReactions] = useState(null);
  const [commentsCount, setCommentsCount] = useState(post?.commentsCount);
  const [sharesCount, setSharesCount] = useState(post?.sharesCount);
  const user = useSelector((state) => ({ ...state.user.userinfo }));

  const postRef = useRef();
  const commentRef = useRef();

  const reactView = useMemo(
    () => getSortedReacts(reactions?.types || {}),
    [reactions?.types]
  );

  const check = reactions?.isLiked;
  const images = post.images;

  const handleMouseEnter = (event) => {
    clearTimeout(delayHandler);
    setDelayHandler(
      setTimeout(() => {
        setShowReact(true);
      }, 800)
    );
  };

  const handleMouseLeave = () => {
    clearTimeout(delayHandler);
    setDelayHandler(
      setTimeout(() => {
        setShowReact(false);
      }, 800)
    );
  };

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 5],
        },
      },
    ],
  });

  const {
    mutate: addReact,
    data: reactionData,
    isSuccess,
    isLoading,
  } = useReaction();

  useEffect(() => {
    setReactions(post.reactions);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setReactions(reactionData.data.reactions);
    }
  }, [isSuccess, reactionData]);

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

  const reactHandler = (type) => {
    handleMouseLeave();
    if (!isLoading) {
      setReactions((prev) => {
        return {
          ...prev,
          isLiked: prev.isLiked === type ? "" : type,
          totalCount:
            prev.totalCount +
            (prev.isLiked === "" ? 1 : prev.isLiked !== type ? 0 : -1),
          types: {
            ...prev.types,
            [type]:
              (prev.types[type] || 0) +
              (prev.isLiked === "" ? 1 : prev.isLiked !== type ? 0 : -1),
          },
        };
      });
      addReact({ type, post: post._id });
    } else {
      return;
    }
  };
  const commentCountHandler = (count) => {
    setCommentsCount(count);
  };
  return (
    <Card className={classes.post} innerRef={postRef}>
      <div className={classes.header}>
        <div className={classes.left}>
          <Link to={`/profile/${post?.user?.username}`}>
            <img src={post.user.photo} alt="" />
          </Link>
        </div>
        <div className={classes.middle}>
          <div>
            <Link
              to={`/profile/${post?.user?.username}`}
              className={classes.username}
            >
              {`${post.user.first_name} ${post.user.last_name}`}
              {post?.user?.confirmed && (
                <i
                  style={{ marginLeft: "5px", transform: "translateY(2px)" }}
                  className="confirmed_comment_icon"
                />
              )}
            </Link>

            {post.type === "profilePhoto" ? (
              <span className={classes.profilePhotoText}>
                {`updated ${post.user.gender === "male" ? "his" : "her"} profile
                picture`}
              </span>
            ) : post.type === "cover" ? (
              <span className={classes.profilePhotoText}>
                {`updated ${post.user.gender === "male" ? "his" : "her"} profile
            cover`}
              </span>
            ) : post.type === "share" ? (
              <span className={classes.profilePhotoText}>{`Shared post`}</span>
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
        <div className={classes.right}>
          <div onClick={() => setShowMenu((prev) => !prev)}>
            <Dots color="#828387" />
          </div>
          {showMenu && (
            <PostMenu
              user={user}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              post={post}
              postRef={postRef}
            />
          )}
        </div>
      </div>
      <div className={classes.body}>
        {post.type === "background" && (
          <div
            className={classes.background}
            style={{
              backgroundImage: `url(${postBackgrounds[post.background - 1]})`,
              direction: `${isRTL(post.text) ? "rtl" : "ltr"}`,
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
              style={{
                direction: `${isRTL(post.text) ? "rtl" : "ltr"}`,
              }}
              className={classes.normal}
            >
              {post.text}
            </div>
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
                  : classes.per1
              }`}
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
              className={classes.normal}
              style={{
                direction: `${isRTL(post.text) ? "rtl" : "ltr"}`,
              }}
            >
              {post.text}
            </div>
            <div className={`${classes.profilePhoto_wrap} `}>
              <div
                className={classes.cover}
                style={{ backgroundImage: `url(${post.user.cover})` }}
              ></div>
              <img
                onClick={() => openImageViewer(0)}
                src={post.images[0]}
                alt={post.text}
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
        {post.type === "share" && (
          <>
            <div
              className={classes.normal}
              style={{
                fontSize: `${String(post.text).length > 20 ? "15px" : ""}`,
                direction: `${isRTL(post.text) ? "rtl" : "ltr"}`,
              }}
            >
              {post.text}
            </div>
            <div className={classes.share}>
              <SharedPost post={post.sharedID} />
            </div>
          </>
        )}
      </div>
      <div className={classes.footer}>
        <div className={classes.infos}>
          <div
            className={classes.left}
            onClick={() => setShowLikes((perv) => !perv)}
          >
            <div className={classes.reacts_view}>
              {reactView.map((react, i) => (
                <img src={`../../../reacts/${react}.svg`} alt="" key={i} />
              ))}
            </div>
            <span>{reactions?.totalCount > 0 && reactions?.totalCount}</span>
          </div>
          <div className={classes.right}>
            <span>{commentsCount} comments</span>
            <span>{sharesCount} shares</span>
          </div>
        </div>
        <div className={classes.actions}>
          {showReact && (
            <Portal id="reactPopper">
              <div
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
              >
                <ReactsPopup
                  reactHandler={reactHandler}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  setShowReact={setShowReact}
                  showReact={showReact}
                />
              </div>
            </Portal>
          )}
          <div
            className={`${classes.action_elment} hover1`}
            id="reactPopper"
            ref={setReferenceElement}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              handleMouseLeave();
              reactHandler(check ? check : "like");
            }}
            onTouchStart={handleMouseEnter}
            // onTouchEnd={handleMouseLeave}
          >
            {check ? (
              <img
                src={`../../../reacts/${check}.svg`}
                alt=""
                className="small_react"
                style={{ width: "18px" }}
              />
            ) : (
              <i className="like_icon"></i>
            )}
            <span
              style={{
                color: `
                    ${
                      check === "like"
                        ? "#029afc"
                        : check === "love"
                        ? "#f63459"
                        : check === "haha"
                        ? "#f7b125"
                        : check === "sad"
                        ? "#f7b125"
                        : check === "wow"
                        ? "#f7b125"
                        : check === "angry"
                        ? "#e4605a"
                        : ""
                    }
                `,
              }}
            >
              {check ? check : "Like"}
            </span>
          </div>

          <div
            className={`${classes.action_elment} hover1`}
            onClick={() => {
              commentRef.current.focus();
            }}
          >
            <i className="comment_icon"></i>
            <span>Comment</span>
          </div>

          {post.type === "share" ? (
            ""
          ) : (
            <>
              <div
                className={`${classes.action_elment} hover1`}
                onClick={() => setShowShare((perv) => !perv)}
              >
                <i className="share_icon"></i>
                <span>Share</span>
              </div>
              {showShare && (
                <ShareMenu
                  user={user}
                  showMenu={showShare}
                  setShowMenu={setShowShare}
                  post={post}
                  postRef={postRef}
                  setSharesCount={setSharesCount}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className={classes.create_comment}>
        <CreateComment
          commentCountHandler={commentCountHandler}
          commentRef={commentRef}
          setLastCommentData={setLastCommentData}
          post={post._id}
          placholdertxt="Write a comment ..."
        />
      </div>

      <Comments
        lastComment={post?.lastComment[0]}
        commentsCount={post?.commentsCount}
        postID={post._id}
        lastCommentData={lastCommentData}
        user={user}
        commentRef={commentRef}
      />

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

      {showLikes && (
        <PostLikes
          postID={post._id}
          showLikes={showLikes}
          setShowLikes={setShowLikes}
        />
      )}
    </Card>
  );
}

export default Post;
