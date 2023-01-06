import React, { useRef } from "react";
import Portal from "../../../../utils/Portal";
import Card from "../../../UI/Card/Card";
import classes from "../Post.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import useOnClickOutside from "../../../../hooks/useOnClickOutside";

function PostLikes({ showLikes, setShowLikes, postID }) {
  const pRef = useRef();
  const { isLoading, error, data, isFetching, isSuccess } = useQuery({
    queryKey: ["getReacts", postID],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/${postID}/reacts/`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });

  useOnClickOutside(pRef, showLikes, () => {
    setShowLikes(false);
  });
  return (
    <Portal>
      <div className={`blur ${classes.post_likes}`}>
        <Card className={classes.post_likes_card} innerRef={pRef}>
          <div className={classes.pheader}>
            <span>All</span>
            {data?.data.stats.types &&
              Object.entries(data?.data.stats.types).map(([key, value]) => {
                return (
                  <div key={key} className={classes.reacts_info_wrap}>
                    <img src={`../../../reacts/${key}.svg`} alt="" />
                    <p
                      style={{
                        color: `
                    ${
                      key === "like"
                        ? "#029afc"
                        : key === "love"
                        ? "#f63459"
                        : key === "haha"
                        ? "#f7b125"
                        : key === "sad"
                        ? "#f7b125"
                        : key === "wow"
                        ? "#f7b125"
                        : key === "angry"
                        ? "#e4605a"
                        : ""
                    }
                `,
                      }}
                    >
                      {value.toString()}
                    </p>
                  </div>
                );
              })}
            <div className={`${classes.exit} small_circle`}>
              <i
                onClick={() => {
                  setShowLikes((perv) => !perv);
                }}
                className="exit_icon"
              ></i>
            </div>
          </div>
          <div className={classes.content}>
            {data?.data.reacts &&
              data?.data.reacts.map((react, i) => (
                <Link
                  to={`/profile/${react.user.username}`}
                  key={react._id}
                  className={`${classes.react_user} hover3`}
                >
                  <div className={classes.react_user_wrap}>
                    <img
                      className={classes.react_user_img}
                      src={react.user.photo}
                      alt=""
                    />
                    <img
                      src={`../../../reacts/${react.type}.svg`}
                      alt=""
                      className={classes.react_icon}
                    />
                  </div>
                  <span>
                    {react.user.first_name} {react.user.last_name}
                  </span>
                </Link>
              ))}
          </div>
        </Card>
      </div>
    </Portal>
  );
}

export default PostLikes;
