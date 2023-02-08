import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/UI/Card/Card";
import { useGetChat } from "../../hooks/useGetChat";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { useRelationship } from "../../hooks/useRealationship";
import classes from "./style.module.css";

function Friendship({ friendship: friendshipData, userID, usernameID }) {
  let navigate = useNavigate();

  const [friendship, setFriendship] = useState(friendshipData);
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);

  const menuRef = useRef(null);
  const menu1 = useRef(null);

  useOnClickOutside(menuRef, friendsMenu, () => {
    setFriendsMenu(false);
  });
  useOnClickOutside(menu1, respondMenu, () => {
    setRespondMenu(false);
  });

  const { mutate, data, isSuccess } = useRelationship(usernameID);

  const {
    mutate: getChat,
    data: chatData,
    isSuccess: isGetChatSuccess,
  } = useGetChat();

  const addFriendHandler = () => {
    mutate({ id: userID, type: "add" });
  };

  const unfollowHandler = () => {
    mutate({ id: userID, type: "unfollow" });
  };

  const followHandler = () => {
    mutate({ id: userID, type: "follow" });
  };

  const acceptRequestHanlder = () => {
    mutate({ id: friendship.requestID, type: "acceptRequest" });
  };

  const unfriendHandler = () => {
    mutate({ id: friendship.requestID, type: "remove" });
  };

  const cancelRequestHandler = () => {
    mutate({ id: friendship.requestID, type: "cancel" });
  };

  const getChatHandler = () => {
    getChat({ user: userID });
  };

  useEffect(() => {
    if (isSuccess) {
      setFriendship(data.data.friendship);
    }
  }, [data]);

  useEffect(() => {
    setFriendship(friendshipData);
  }, [friendshipData]);

  useEffect(() => {
    if (chatData?.status === "success") {
      navigate(`/messages/${chatData.data.chat._id}`);
    }
  }, [isGetChatSuccess]);

  return (
    <div className={classes.btns}>
      {friendship?.friends ? (
        <>
          <button
            className="gray_btn"
            onClick={() => setFriendsMenu((perv) => !perv)}
          >
            <img src="../../../icons/friends.png" alt="" />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <Card className={classes.open_cover_menu} innerRef={menuRef}>
              {friendship?.following ? (
                <div
                  className={`${classes.item} hover1`}
                  onClick={() => unfollowHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Unfollow
                </div>
              ) : (
                <div
                  className={`${classes.item} hover1`}
                  onClick={() => followHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Follow
                </div>
              )}
              <div
                className={`${classes.item} hover1`}
                onClick={() => unfriendHandler()}
              >
                <i className="unfriend_outlined_icon"></i>
                Unfriend
              </div>
            </Card>
          )}
        </>
      ) : (
        !friendship?.requestSent &&
        !friendship?.requestReceived && (
          <button className="btn_blue" onClick={() => addFriendHandler()}>
            <img src="../../../icons/addFriend.png" alt="" className="invert" />
            <span>Add Friend</span>
          </button>
        )
      )}
      {friendship?.requestSent ? (
        <button className="btn_blue" onClick={() => cancelRequestHandler()}>
          <img
            src="../../../icons/cancelRequest.png"
            className="invert"
            alt=""
          />
          <span>Cancel Request</span>
        </button>
      ) : (
        friendship?.requestReceived && (
          <>
            <button
              className="gray_btn"
              onClick={() => setRespondMenu((perv) => !perv)}
            >
              <img src="../../../icons/friends.png" alt="" />
              <span>Respond</span>
            </button>
            {respondMenu && friendship?.requestReceived && (
              <Card className={classes.open_cover_menu} innerRef={menu1}>
                <div
                  className={`${classes.item} hover1`}
                  onClick={() => acceptRequestHanlder()}
                >
                  Confirm
                </div>
                <div
                  className={`${classes.item} hover1`}
                  onClick={() => cancelRequestHandler()}
                >
                  Delete
                </div>
              </Card>
            )}
          </>
        )
      )}
      {friendship?.following ? (
        <button className="gray_btn" onClick={() => unfollowHandler()}>
          <img src="../../../icons/follow.png" alt="" />
          <span>Following</span>
        </button>
      ) : (
        <button className="btn_blue" onClick={() => followHandler()}>
          <img src="../../../icons/follow.png" className="invert" alt="" />
          <span style={{ color: "#fff" }}>Follow</span>
        </button>
      )}
      <button
        className={friendship?.friends ? "btn_blue" : "gray_btn"}
        onClick={() => getChatHandler()}
      >
        <img
          src="../../../icons/message.png"
          className={friendship?.friends && "invert"}
          alt=""
        />
        <span>Message</span>
      </button>
    </div>
  );
}

export default Friendship;
