import React from "react";
import classes from "../posts/post/Post.module.css";
import Card from "../UI/Card/Card";
import Skeleton from "react-loading-skeleton";

function PostSkeleton() {
  return (
    <Card className={classes.post}>
      <div className={classes.header}>
        <div className={classes.left}>
          <Skeleton
            circle
            height={40}
            width={40}
            containerClassName="avatar-skeleton"
          />
        </div>
        <div className={classes.middle}>
          <Skeleton
            width={150}
            height={15}
            style={{
              transform: "translateY(4px)",
            }}
          />
          <Skeleton width={80} height={8} />
        </div>
      </div>
      <div className={classes.body} style={{ padding: "10px" }}>
        <Skeleton count={3} height={18} width="100%" />
        <Skeleton count={2} height={10} width="100%" />
      </div>
    </Card>
  );
}

export default PostSkeleton;
