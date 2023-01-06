import React, { useRef, useEffect } from "react";
import { useDeletePost } from "../../../hooks/useDeletePost";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import Card from "../../UI/Card/Card";
import MenuItem from "./MenuItem";
import classes from "./Post.module.css";
import { saveAs } from "file-saver";
import { IoIosLink } from "react-icons/io";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";

function PostMenu({ showMenu, setShowMenu, post, user, postRef }) {
  const menuRef = useRef();
  const isOwner = post.user._id === user._id;

  const { data, mutate } = useDeletePost(post._id);
  const deleteHandler = () => {
    mutate({ post: post._id });
  };

  const downloadImages = async () => {
    post.images.foreach((img) => {
      const filename = img.split("/").pop();
      saveAs(img, filename);
    });
    setShowMenu(false);
  };

  useEffect(() => {
    if (data?.status === "success") {
      toast.success("Successfully removed!");
      postRef.current.remove();
    }
  }, [data, postRef]);

  useOnClickOutside(menuRef, showMenu, () => {
    setShowMenu(false);
  });

  const full = `${window.location.origin}/${post.user.username}/posts/${post._id}`;

  return (
    <Card className={classes.menu} innerRef={menuRef}>
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
        <MenuItem
          icon="save_icon"
          title="Save Post"
          subtitle="Add this to your saved items."
        />
        {post.images.length > 0 && (
          <div onClick={() => downloadImages()}>
            <MenuItem icon="download_icon" title="Download" />
          </div>
        )}
        {isOwner && (
          <>
            <div className="line" />
            <div onClick={() => deleteHandler()}>
              <MenuItem
                icon="trash_icon"
                title="Move to trash"
                subtitle="items in your trash are deleted after 30 days"
              />
            </div>
          </>
        )}
      </ul>
    </Card>
  );
}

export default PostMenu;
