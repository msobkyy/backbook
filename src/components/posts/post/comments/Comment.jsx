import React, { useState, useEffect, useRef } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import CreateComment from "./CreateComment";
import classes from "./Comments.module.css";
import { useSelector } from "react-redux";
import { useCommentLike } from "../../../../hooks/useCommentLike";
import { IoReturnDownForwardOutline } from "react-icons/io5";

function Comment({ comment }) {
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState(comment.replies);
  const [likes, setLikes] = useState(comment.likes);
  const [count, setCount] = useState(0);
  const [repliesHeight, setRepliesHeight] = useState(0);
  const replyCommentRef = useRef();
  const repliesRef = useRef();

  const {
    isSuccess: commentLikeSuccess,
    data: commentLikes,
    mutate: commentLike,
  } = useCommentLike(comment._id);

  const isliked = likes.includes(user._id);
  const likesCount = likes.length;

  const commentLikeHandler = () => {
    if (isliked) {
      setLikes(likes.filter((like) => like !== user._id));
    } else {
      setLikes([...likes, user._id]);
    }
    commentLike({ comment: comment._id });
  };

  useEffect(() => {
    if (commentLikes?.status === "success") {
      setLikes(commentLikes.data.likes);
    }
  }, [commentLikeSuccess, commentLikes]);

  useEffect(() => {
    setTimeout(() => {
      setRepliesHeight(repliesRef.current.clientHeight);
    }, 50);
  }, [replies, count]);

  return (
    <div className={`${classes.info_wrap} ${classes.comment}`}>
      <div
        className={`${classes.left} ${classes.comment_user_wrap}`}
        ref={repliesRef}
      >
        <img src={comment.user.photo} alt="" />
      </div>
      <div className={classes.right}>
        <div className={classes.comment_info}>
          <Link
            to={`/profile/${comment.user.username}`}
            className={classes.user}
          >
            {`${comment.user.first_name} ${comment.user.last_name}`}
            {comment.user?.confirmed && (
              <i
                style={{ marginLeft: "5px" }}
                className="confirmed_comment_icon"
              />
            )}
          </Link>
          <div className={classes.text}>{comment.text}</div>
          {comment.photo && (
            <div className={classes.img_info}>
              <img src={comment.photo} alt={comment.text} />
            </div>
          )}
          {likesCount > 0 && (
            <div className={classes.comment_likes}>
              <img src={`../../../reacts/like.svg`} alt="" />
              <p>{likesCount}</p>
            </div>
          )}
        </div>
        <div className={classes.comment_info_footer}>
          <p
            className={isliked ? classes.liked : ""}
            onClick={commentLikeHandler}
          >
            Like
          </p>
          <p
            onClick={() => {
              setShowReply(true);
              setTimeout(() => {
                replyCommentRef.current.focus();
              }, 50);
            }}
          >
            Reply
          </p>
          <Moment fromNow interval={30} className={classes.c_time}>
            {comment.createdAt}
          </Moment>
        </div>
        {/* Comment Replies */}
        <div className={classes.replies_wrap}>
          {replies.slice(0, count).map((comment, i, { length }) => (
            <div className={classes.info_wrap} key={comment._id}>
              <div className={classes.left}>
                <img src={comment.user.photo} alt="" />
              </div>
              <div className={classes.right}>
                <div className={classes.comment_info}>
                  <Link
                    to={`/profile/${comment.user.username}`}
                    className={classes.user}
                  >
                    {`${comment.user.first_name} ${comment.user.last_name}`}{" "}
                    {comment.user?.confirmed && (
                      <i
                        style={{ marginLeft: "5px" }}
                        className="confirmed_comment_icon"
                      />
                    )}
                  </Link>
                  <div className={classes.text}>{comment.text}</div>
                  {comment.photo && (
                    <div className={classes.img_info}>
                      <img src={comment.photo} alt={comment.text} />
                    </div>
                  )}
                </div>
                <div className={classes.comment_info_footer}>
                  <p
                    onClick={() => {
                      setShowReply(true);
                      setTimeout(() => {
                        replyCommentRef.current.focus();
                      }, 50);
                    }}
                  >
                    Reply
                  </p>
                  <Moment fromNow interval={30} className={classes.c_time}>
                    {comment.createdAt}
                  </Moment>
                </div>
              </div>
              <div className={classes.tree}>
                {i + 1 === length && (
                  <div
                    style={{ height: `calc(${repliesHeight}px )` }}
                    className={classes.tree_line}
                  >
                    {" "}
                  </div>
                )}
              </div>
            </div>
          ))}
          {replies.length > count && (
            <>
              <div
                className={classes.view_more}
                onClick={() => {
                  setCount((perv) => perv + 3);
                  setShowReply(true);
                }}
              >
                {count === 0 ? (
                  <>
                    <IoReturnDownForwardOutline />
                    {` ${replies.length} ${
                      replies.length === 1 ? "reply" : "replies"
                    }`}
                  </>
                ) : (
                  `( ${replies.length - count} ) replies View more replies`
                )}
              </div>
            </>
          )}
        </div>
        {showReply && (
          <CreateComment
            placholdertxt={`@${comment.user.first_name} ${comment.user.last_name} reply ...`}
            commentRef={replyCommentRef}
            type="reply"
            setReplies={setReplies}
            setCount={setCount}
            post={comment._id}
          />
        )}
      </div>
    </div>
  );
}

export default Comment;
