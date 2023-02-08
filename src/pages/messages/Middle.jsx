import React, { useState, useRef } from "react";
import { ArrowDown1, Info, Like, Phone } from "../../svg";
import styles from "./messages.module.css";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { socket } from "../../routes/IsLoggedIn";
import Moment from "react-moment";
import Lottie from "react-lottie-player";
import typingAnimation from "../../components/UI/Lottie/typing.json";
import { useInView } from "react-intersection-observer";
import { useSeenMessage } from "../../hooks/useSeenMessage";
import SeenStatus from "./SeenStatus";

import {
  isFirstMsg,
  isLastMsg,
  isSameUser,
  isSingleMsg,
} from "../../utils/messagesPosition";
import Right from "./Right";
import SendMessage from "./SendMessage";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-hot-toast";
import { chatThemes } from "../../data/chatThemes";
import radialToLinearGradient from "../../utils/radialToLinearGradient";

function Middle({ chatId, soketSlice, user, pView, setOpenInfo, openInfo }) {
  const messagesEndRef = useRef();
  const { ref: seenRef, inView: seenView } = useInView();
  const { ref: fetchNextRef, inView: fetchNextView } = useInView();

  let navigate = useNavigate();

  const [isTyping, setIsTyping] = useState({ room: "", status: false });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/messages/${chatId}?sort=-createdAt&limit=100&page=${pageParam}`,
      {
        withCredentials: true,
      }
    );
    return data;
  };

  const {
    isLoading: isGetMessagesLoading,
    data: getMessagesData,
    isSuccess: isGetMessagesSuccess,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getMessages", chatId],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 100) {
        return undefined;
      } else {
        return pages.length + 1;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      navigate("/messages", { replace: true });
    },
  });

  const FilterdMessages = getMessagesData?.pages
    ?.map((page) => page.data.messages)
    .reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue);
    }, []);

  const currentChat = getMessagesData?.pages[0]?.data?.chat;

  const isChatSkelton =
    isGetMessagesLoading &&
    !isGetMessagesSuccess &&
    !getMessagesData &&
    !getMessagesData?.data;

  const chatTheme =
    chatThemes[getMessagesData?.pages[0]?.data?.chat?.theme - 1];

  const { mutate: seenMessage } = useSeenMessage(
    getMessagesData?.pages[0]?.data?.chat
  );

  useEffect(() => {
    scrollToBottom();
  }, [chatId]);

  useEffect(() => {
    socket.emit("join_room", chatId);
    socket.on("typing", ({ room, status }) => {
      setIsTyping({ room, status });
    });
  }, [chatId]);

  useEffect(() => {
    if (
      seenView &&
      currentChat?.latestMessage?.seen === "unseen" &&
      currentChat?._id === chatId &&
      currentChat?.latestMessage?.sender._id !== user._id
    ) {
      seenMessage({
        messageId: currentChat?.latestMessage?._id,
      });
    }
  }, [seenView, getMessagesData]);

  useEffect(() => {
    if (fetchNextView) {
      fetchNextPage();
    }
  }, [fetchNextView]);

  const skl = (
    <div style={{ padding: "10px" }}>
      <div className={`${styles.message}`}>
        <Skeleton
          height={30}
          width={170}
          style={{
            transform: "translateY(4px)",
            borderRadius: "20px",
          }}
        />
      </div>
      <div className={`${styles.message} ${styles.message_user}`}>
        <Skeleton
          height={30}
          width={150}
          style={{
            transform: "translateY(4px)",
            borderRadius: "20px",
          }}
        />
      </div>
      <div className={`${styles.message} ${styles.message_user}`}>
        <Skeleton
          height={30}
          width={100}
          style={{
            transform: "translateY(4px)",
            borderRadius: "20px",
          }}
        />
      </div>
      <div className={`${styles.message}`}>
        <Skeleton
          height={30}
          width={100}
          style={{
            transform: "translateY(4px)",
            borderRadius: "20px",
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.middle}>
        <div className={styles.middle_header}>
          {!pView && (
            <Link
              to={`/messages`}
              className={`${styles.icon} ${styles.rotate90}`}
            >
              <ArrowDown1 />
            </Link>
          )}

          <div className={styles.chat_img}>
            {isChatSkelton ? (
              ""
            ) : (
              <div className={styles.chat_img2}>
                <img src={currentChat?.photo} alt="" />
                {soketSlice.onlineUsers.find(
                  (u) => u.id === currentChat?.users[0]?._id
                ) &&
                  currentChat?.type === "private" && (
                    <span className={styles.green_dot} />
                  )}
              </div>
            )}

            <div className={styles.chat_info}>
              {isChatSkelton ? "" : <span>{currentChat?.chatName}</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <div className="hover2 small_circle">
              <Phone
                color={
                  chatTheme?.type === "gradient"
                    ? chatTheme?.topColor
                    : chatTheme?.color
                }
              />
            </div>
            <div
              className="hover2 small_circle"
              onClick={() => {
                setOpenInfo((prev) => !prev);
              }}
            >
              <Info
                color={
                  chatTheme?.type === "gradient"
                    ? chatTheme?.topColor
                    : chatTheme?.color
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.messages}>
          <div ref={messagesEndRef} />
          {isTyping.status && isTyping.room === chatId ? (
            <div className={`${styles.message} ${styles.message_user}`}>
              <div className={styles.meesage_user}>
                <img src={currentChat?.photo} alt="" />
              </div>
              <Lottie
                style={{
                  transform: "translateY(2px)",
                  height: 35,
                }}
                animationData={typingAnimation}
                loop
                play
              />
            </div>
          ) : (
            ""
          )}
          {!isChatSkelton ? (
            <>
              {FilterdMessages?.map((message, i) => {
                return (
                  <div
                    key={message._id}
                    ref={i === 0 && isSameUser(message, user) ? seenRef : null}
                  >
                    {message.type === "text" || message.type === "like" ? (
                      <div
                        className={`${styles.message} ${
                          isSameUser(message, user) ? styles.message_user : ""
                        }`}
                        key={message._id}
                      >
                        {isSameUser(message, user) && (
                          <div className={styles.meesage_user}>
                            {isLastMsg(message, FilterdMessages, i) ||
                            isSingleMsg(message, FilterdMessages, i) ? (
                              <img src={message.sender.photo} alt="" />
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                        {!isSameUser(message, user) &&
                          (isLastMsg(message, FilterdMessages, i) ||
                            isSingleMsg(message, FilterdMessages, i)) && (
                            <div className={styles.msg_date}>
                              <Moment fromNow interval={30}>
                                {message.updatedAt}
                              </Moment>
                            </div>
                          )}
                        {message.type === "like" ? (
                          <Like
                            height="60"
                            width="60"
                            style={{ marginTop: "10px" }}
                            color={chatTheme?.color}
                          />
                        ) : (
                          <div
                            style={{
                              backgroundColor: !isSameUser(message, user)
                                ? chatTheme?.color
                                : "",
                              backgroundImage:
                                !isSameUser(message, user) &&
                                chatTheme?.type === "gradient"
                                  ? radialToLinearGradient(chatTheme?.data)
                                  : "",
                            }}
                            className={`${styles.message_content} ${
                              isSameUser(message, user)
                                ? styles.message_content_user
                                : ""
                            } ${
                              isSameUser(message, user) &&
                              isFirstMsg(message, FilterdMessages, i)
                                ? styles.m_c_u_first_radius
                                : ""
                            } ${
                              isSameUser(message, user) &&
                              isLastMsg(message, FilterdMessages, i)
                                ? styles.m_c_u_last_radius
                                : ""
                            } ${
                              !isSameUser(message, user) &&
                              isFirstMsg(message, FilterdMessages, i)
                                ? styles.m_c_first_radius
                                : ""
                            } ${
                              !isSameUser(message, user) &&
                              isLastMsg(message, FilterdMessages, i)
                                ? styles.m_c_last_radius
                                : ""
                            } ${
                              isSingleMsg(message, FilterdMessages, i)
                                ? styles.single_radius
                                : ""
                            }`}
                          >
                            {message.content}
                          </div>
                        )}
                        {!isSameUser(message, user) && (
                          <div className={styles.msg_space}>
                            {i === 0 ? (
                              <SeenStatus chat={currentChat} user={user} />
                            ) : (
                              ""
                            )}
                          </div>
                        )}

                        {isSameUser(message, user) &&
                          (isLastMsg(message, FilterdMessages, i) ||
                            isSingleMsg(message, FilterdMessages, i)) && (
                            <div className={styles.msg_date}>
                              <Moment fromNow interval={30}>
                                {message.updatedAt}
                              </Moment>
                            </div>
                          )}
                      </div>
                    ) : message.type === "info" ? (
                      <div className={styles.info_message}>
                        {message.content}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
              <div
                ref={fetchNextRef}
                disabled={!hasNextPage || isFetchingNextPage}
                style={{
                  marginBottom: "20px",
                  textAlign: "center",
                  color: "var(--color-secondary)",
                }}
              >
                {isFetchingNextPage
                  ? skl
                  : hasNextPage
                  ? "Loading old messages ..."
                  : "No more messages"}
              </div>
            </>
          ) : (
            skl
          )}
        </div>
        <SendMessage
          chat={currentChat}
          chatId={chatId}
          setIsTyping={setIsTyping}
          isTyping={isTyping}
          chatTheme={chatTheme}
          scrollToBottom={scrollToBottom}
        />
      </div>
      {openInfo && (
        <Right
          isChatSkelton={isChatSkelton}
          chat={currentChat}
          soketSlice={soketSlice}
          chatId={chatId}
          user={user}
          setOpenInfo={setOpenInfo}
          pView={pView}
          openInfo={openInfo}
          chatTheme={chatTheme}
        />
      )}
    </>
  );
}

export default Middle;
