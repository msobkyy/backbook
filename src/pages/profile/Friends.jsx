import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/UI/Card/Card";
import classes from "./style.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import Skeleton from "react-loading-skeleton";

function Friends({ userData, userFriends, photosSkelton }) {
  return (
    <Card>
      <div className={classes.card_header}>
        Friends
        <Link className={classes.link} to="/friends/all">
          See all Friends
        </Link>
      </div>
      <div className={classes.content}>
        <div className={classes.info}>
          {photosSkelton ? (
            <Skeleton width={80} height={10} />
          ) : (
            `${userData?.friendsCount} Friends`
          )}
        </div>
        {photosSkelton ? (
          <div className={classes.loading}>
            <PuffLoader color="#1876f2" loading={photosSkelton} size={40} />
          </div>
        ) : (
          <div className={classes.friends_grid}>
            {userFriends &&
              userFriends.slice(0, 9).map((user, i) => (
                <Link to={`/profile/${user.username}`} key={i}>
                  <div
                    className={classes.friend_card}
                    style={{ backgroundImage: `url(${user.photo})` }}
                  ></div>
                  <span className={classes.friend_name}>
                    {user.first_name} {user.last_name}{" "}
                    {user?.confirmed && (
                      <i
                        style={{ marginLeft: "5px" }}
                        className="confirmed_comment_icon"
                      />
                    )}
                  </span>
                </Link>
              ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export default Friends;
