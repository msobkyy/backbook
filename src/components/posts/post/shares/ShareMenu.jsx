import React, { useRef, useState } from "react";
import useOnClickOutside from "../../../../hooks/useOnClickOutside";
import Card from "../../../UI/Card/Card";
import MenuItem from "../MenuItem";
import classes from "../Post.module.css";
import { IoIosLink } from "react-icons/io";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import CreateSharePost from "./CreateSharePost";

function ShareMenu({
  showMenu,
  setShowMenu,
  post,
  user,
  postRef,
  setSharesCount,
}) {
  const menuRef = useRef();

  const [showSharePost, setShowSharePost] = useState(false);

  useOnClickOutside(menuRef, showMenu, () => {
    if (showSharePost) return;
    setShowMenu(false);
  });

  const full = `${window.location.origin}/${post.user.username}/posts/${post._id}`;

  return (
    <Card
      className={classes.menu}
      innerRef={menuRef}
      style={{ padding: "10px" }}
    >
      <ul>
        <CopyToClipboard
          text={full}
          onCopy={() => {
            toast.success("Successfully Copied!");
            setShowMenu(false);
          }}
        >
          <li className="hover1">
            <IoIosLink size={22} />
            <div className={classes.post_menu_text}>
              <span>Copy post link</span>
              <span className={classes.menu_post_col}>
                Copy post link to clipboard
              </span>
            </div>
          </li>
        </CopyToClipboard>

        <div className="line" />
        <div onClick={() => setShowSharePost((perv) => !perv)}>
          <MenuItem
            icon="share_icon"
            title="Share Post"
            subtitle="Share post to your friends"
          />
        </div>
      </ul>
      {showSharePost && (
        <CreateSharePost
          showSharePost={showSharePost}
          setShowSharePost={setShowSharePost}
          post={post}
          setSharesCount={setSharesCount}
        />
      )}
    </Card>
  );
}

export default ShareMenu;
