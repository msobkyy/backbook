import React, { useState } from "react";
import styles from "./messages.module.css";
import { Link } from "react-router-dom";
import ChatInfo from "../../components/messages/chatInfo/chatInfo";
import CreateGroup from "../../components/messages/createGroup/CreateGroup";
import { useRemoveMember } from "../../hooks/useRemoveMember";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { useRef } from "react";
import Skeleton from "react-loading-skeleton";
import ChatTheme from "../../components/messages/chatTheme/ChatTheme";
import radialToLinearGradient from "../../utils/radialToLinearGradient";

function Right({
  isChatSkelton,
  chat,
  soketSlice,
  chatId,
  user,
  setOpenInfo,
  pView,
  openInfo,
  chatTheme,
}) {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showChatTheme, setShowChatTheme] = useState(false);
  const [createGroupType, setCreateGroupType] = useState("add");

  const infoRef = useRef();

  useOnClickOutside(infoRef, openInfo, () => {
    if (!pView) setOpenInfo(false);
  });
  const { mutate: RemoveMember } = useRemoveMember(chat);

  const removeMemberHandler = (userId) => {
    RemoveMember({ chatId, userId });
  };

  return (
    <div className={styles.right} ref={infoRef}>
      {!isChatSkelton ? (
        <>
          {!pView && (
            <div
              style={{ margin: "10px" }}
              className="small_circle"
              onClick={() => {
                setOpenInfo((prev) => !prev);
              }}
            >
              <i className="exit_icon" />
            </div>
          )}
          <div className={styles.right_header}>
            <div className={styles.pfp}>
              <img src={chat?.photo} alt="" />
              {soketSlice.onlineUsers.find(
                (u) => u.id === chat?.users[0]?._id
              ) &&
                chat?.type === "private" && (
                  <span className={styles.green_dot} />
                )}
            </div>

            {chat?.type === "group" ? (
              <span>{chat?.chatName}</span>
            ) : (
              <Link
                className={styles.profile_link}
                to={`/profile/${chat?.users[0]?.username}`}
              >
                {chat?.chatName}
              </Link>
            )}
          </div>
          <div className={styles.chat_infos}>
            {showCreateGroup && (
              <CreateGroup
                type={createGroupType}
                setShowCreateGroup={setShowCreateGroup}
                showCreateGroup={showCreateGroup}
                chat={chat}
              />
            )}
            {showChatTheme && (
              <ChatTheme
                setShowChatTheme={setShowChatTheme}
                showChatTheme={showChatTheme}
                chatTheme={chatTheme}
                chat={chat}
              />
            )}
            {true ? (
              <>
                <ChatInfo title={"Chat Members"}>
                  {chat?.groupAdmin?._id === user._id ? (
                    <div
                      className={`${styles.chat_info_item} hover2`}
                      onClick={() => {
                        setCreateGroupType("add");
                        setShowCreateGroup(true);
                      }}
                    >
                      <div className="small_circle">
                        <img
                          src="../../../icons/plus.png"
                          alt=""
                          className="invert1"
                        />
                      </div>
                      Add member
                    </div>
                  ) : (
                    ""
                  )}

                  {chat?.users.map((member) => (
                    <div key={member._id} className={styles.group_member}>
                      <Link to={`/profile/${member.username}`}>
                        <img src={member.photo} alt="" />
                      </Link>

                      <div
                        className={styles.group_member_info}
                        style={{ flex: "1" }}
                      >
                        <span>{`${member.first_name} ${member.last_name}`}</span>
                        <span className={styles.group_member_info2}>
                          {chat?.groupAdmin?._id === member._id
                            ? "Group Admin"
                            : "Member"}
                        </span>
                      </div>
                      {chat?.groupAdmin?._id === user._id ? (
                        <span
                          className={styles.remoe_member}
                          onClick={() => {
                            removeMemberHandler(member._id);
                          }}
                        >
                          Remove
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </ChatInfo>
                {chat?.groupAdmin?._id === user._id ||
                chat?.type === "private" ? (
                  <ChatInfo title={"Customize chat"}>
                    {chat?.type === "group" ? (
                      <div
                        className={`${styles.chat_info_item} hover2`}
                        onClick={() => {
                          setCreateGroupType("rename");
                          setShowCreateGroup(true);
                        }}
                      >
                        <div className="small_circle">
                          <img
                            src="../../../icons/plus.png"
                            alt=""
                            className="invert1"
                          />
                        </div>
                        Change Name
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      className={`${styles.chat_info_item} hover2`}
                      onClick={() => {
                        setShowChatTheme(true);
                      }}
                    >
                      <div className="small_circle">
                        <div
                          style={{
                            background: `linear-gradient(var(--bg-third), var(--bg-third)) padding-box, ${
                              chatTheme?.type === "gradient"
                                ? radialToLinearGradient(chatTheme?.data)
                                : `linear-gradient(${chatTheme?.color} , ${chatTheme?.color})`
                            } border-box`,
                          }}
                          className={styles.theme_circle}
                        />
                      </div>
                      Change theme
                    </div>
                  </ChatInfo>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </>
      ) : (
        <div className={styles.right_header}>
          <Skeleton circle height={80} width={80} />
          <Skeleton height={20} width={120} />
        </div>
      )}
    </div>
  );
}

export default Right;
