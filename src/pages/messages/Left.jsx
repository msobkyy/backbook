import React from "react";
import { useState, useRef } from "react";

import styles from "./messages.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Card from "../../components/UI/Card/Card";
import ScrollContainer from "react-indiana-drag-scroll";
import SeenStatus from "./SeenStatus";
import { Dots, Search } from "../../svg";
import SearchUser from "../../components/messages/SearchUser";
import CreateGroup from "../../components/messages/createGroup/CreateGroup";
import { useNavigate } from "react-router-dom";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { useGetChat } from "../../hooks/useGetChat";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";

function Left({ soketSlice, user, chatId }) {
  const input = useRef();
  const menuRef = useRef();
  let navigate = useNavigate();

  const [showIcon, setShowIcon] = useState(true);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const color = "#65676b";
  const renderMessage = (message) => {
    if (message.length > 30) {
      return message.slice(0, 30) + "..";
    } else {
      return message;
    }
  };

  const {
    isLoading: isChatLoading,
    data: chatsData,
    isSuccess: isChatSuccess,
  } = useQuery({
    queryKey: ["getChats"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/chats?sort=-updatedAt`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  useOnClickOutside(menuRef, showMenu, () => {
    setShowMenu(false);
  });

  const {
    mutate: getChat,
    data: chatData,
    isLoading: isGetChatLoading,
    isSuccess: isGetChatSuccess,
  } = useGetChat();

  useEffect(() => {
    if (chatData?.status === "success") {
      navigate(`/messages/${chatData.data.chat._id}`);
    }
  }, [isGetChatSuccess]);

  const getChatHandler = (id) => {
    getChat({ user: id });
  };

  return (
    <div className={styles.left}>
      <div className={styles.left_header}>
        <div className={styles.left_header_top}>
          <h2>Chats</h2>
          <div className={styles.menu_wrap}>
            <div
              onClick={() => {
                setShowMenu(true);
              }}
              className={styles.circle_icon}
            >
              <Dots />
            </div>
            {showMenu && (
              <Card innerRef={menuRef} className={styles.menu}>
                <ul>
                  <li
                    className="hover1"
                    onClick={() => {
                      setShowCreateGroup(true);
                    }}
                  >
                    <i className="create_icon"></i>
                    <div className={styles.menu_text}>
                      <span>Create Group</span>
                      <span className={styles.menu_col}>
                        Create Group to chat with your contacts
                      </span>
                    </div>
                  </li>
                </ul>
              </Card>
            )}
          </div>
          {showCreateGroup && (
            <CreateGroup
              type="create"
              setShowCreateGroup={setShowCreateGroup}
              showCreateGroup={showCreateGroup}
            />
          )}
        </div>
        <div
          className={styles.search}
          onClick={() => {
            input.current.focus();
            setShowSearchMenu(true);
          }}
        >
          {showIcon && <Search color={color} />}
          <input
            ref={input}
            type="text"
            name="search"
            placeholder="Search Messenger"
            className={styles.input}
            onFocus={() => {
              setShowIcon(false);
              setShowSearchMenu(true);
            }}
            onBlur={() => setShowIcon(true)}
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchUser
          color={color}
          showSearchMenu={showSearchMenu}
          setShowSearchMenu={setShowSearchMenu}
        />
      )}
      <div className={styles.online_users_wrap}>
        <ScrollContainer>
          <div className={styles.online_users}>
            {soketSlice.onlineUsers.length > 0 &&
              soketSlice.onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className={styles.online_user}
                  onClick={() => {
                    getChatHandler(user.id);
                  }}
                >
                  <div className={styles.img_con}>
                    <img src={user.photo} alt="" />
                    <span className={styles.green_dot} />
                  </div>
                  {user.first_name}
                </div>
              ))}
          </div>
        </ScrollContainer>
      </div>
      <div className="scrollbar" style={{ maxHeight: "90%" }}>
        <div className={styles.chats}>
          {!isChatLoading && isChatSuccess && chatsData ? (
            chatsData?.data.chats.map((chat) => (
              <Link
                key={chat._id}
                to={`/messages/${chat._id}`}
                className={`${styles.chat} hover2 ${
                  chatId === chat._id ? styles.chat_active : ""
                } `}
              >
                <div className={styles.chat_img}>
                  <img src={chat.photo} alt="" />
                  {soketSlice.onlineUsers.find(
                    (u) => u.id === chat.users[0]?._id
                  ) &&
                    chat.type === "private" && (
                      <span className={styles.green_dot} />
                    )}
                </div>
                <div className={styles.chat_info}>
                  <span>{chat.chatName}</span>
                  {chat?.latestMessage && (
                    <p
                      style={{
                        color: `${
                          chat?.latestMessage.seen === "unseen" &&
                          user._id !== chat?.latestMessage.sender._id
                            ? "#0096ff"
                            : ""
                        }`,
                      }}
                    >
                      {renderMessage(
                        `${
                          user._id === chat?.latestMessage.sender._id
                            ? "You :"
                            : chat?.type === "group"
                            ? `${chat?.latestMessage.sender.first_name} : `
                            : ""
                        } ${chat?.latestMessage.content}`
                      )}
                      {" . "}
                      <Moment fromNow interval={30}>
                        {chat.latestMessage.updatedAt}
                      </Moment>
                    </p>
                  )}
                </div>

                <SeenStatus chat={chat} user={user} />
              </Link>
            ))
          ) : (
            <>
              <Skeleton
                className={styles.chat}
                height={76}
                style={{
                  transform: "translateY(4px)",
                }}
              />
              <Skeleton
                className={styles.chat}
                height={76}
                style={{
                  transform: "translateY(4px)",
                }}
              />
              <Skeleton
                className={styles.chat}
                height={76}
                style={{
                  transform: "translateY(4px)",
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Left;
