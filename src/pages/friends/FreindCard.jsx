import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useRelationship } from "../../hooks/useRealationship";
import classes from "./style.module.css";

export default function FriendCard({ user, type, requestId, refetch }) {
  const { mutate, data } = useRelationship(user.username);

  const acceptRequest = async (requestId) => {
    mutate({ id: requestId, type: "acceptRequest" });
  };

  const cancelRequestHandler = async (userId) => {
    mutate({ id: requestId, type: "cancel" });
  };

  useEffect(() => {
    if (data?.status === "success") {
      refetch();
    }
  }, [data]);

  return (
    <div className={classes.req_card}>
      <Link to={`/profile/${user.username}`} className={classes.photo}>
        <img src={user.photo} alt="" />
        <div className={classes.req_name}>
          {user.first_name} {user.last_name}
        </div>
      </Link>
      {type === "sent" ? (
        <div className={classes.btns}>
          <button
            className="btn_blue"
            onClick={() => cancelRequestHandler(requestId)}
          >
            Cancel Request
          </button>
        </div>
      ) : type === "request" ? (
        <div className={classes.btns}>
          <button className="btn_blue" onClick={() => acceptRequest(requestId)}>
            Confirm
          </button>
          <button
            className="gray_btn"
            onClick={() => cancelRequestHandler(requestId)}
          >
            Delete
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
