import React, { useState, useRef, useEffect } from "react";
import { useSendMessage } from "../../hooks/useSendMessage";
import { Like, Photo, Send, Smile } from "../../svg";
import isRTL from "../../utils/isRTL";
import styles from "./messages.module.css";
import { socket } from "../../routes/IsLoggedIn";

function SendMessage({
  chat,
  chatId,
  setIsTyping,
  isTyping,
  chatTheme,
  scrollToBottom,
}) {
  const messageRef = useRef();
  const [messageText, setMessageText] = useState("");
  const [delayHandler, setDelayHandler] = useState(null);
  const isSend = messageText.length > 0;

  const handleEnter = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendHandler();
    }
  };

  const { mutate: sendMessage, isSuccess: isMessageSuccess } =
    useSendMessage(chat);

  const sendHandler = () => {
    if (isSend) {
      sendMessage({ content: messageText, type: "text", chatId });
      socket.emit("typing", { room: chatId, status: false });
      setIsTyping(false);
      setMessageText("");
    } else {
      sendMessage({ content: "like", type: "like", chatId });
    }
  };

  const typingHandler = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { room: chatId, status: true });
    }
    clearTimeout(delayHandler);
    setDelayHandler(
      setTimeout(() => {
        socket.emit("typing", { room: chatId, status: false });
        setIsTyping(false);
      }, 3000)
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [isMessageSuccess]);

  return (
    <div className={styles.send}>
      <Photo
        color={
          chatTheme?.type === "gradient"
            ? chatTheme?.downColor
            : chatTheme?.color
        }
      />
      <Smile
        color={
          chatTheme?.type === "gradient"
            ? chatTheme?.downColor
            : chatTheme?.color
        }
      />
      <div className={styles.send_message_wrap}>
        <textarea
          style={{
            direction: `${isRTL(messageText) ? "rtl" : "ltr"}`,
          }}
          value={messageText}
          ref={messageRef}
          onChange={(e) => {
            typingHandler();
            setMessageText(e.target.value);
          }}
          className={styles.send_message}
          type="text"
          placeholder="Aa"
          onKeyDown={handleEnter}
        />
      </div>
      <div className={styles.send_message_button} onClick={sendHandler}>
        {isSend ? (
          <Send
            color={
              chatTheme?.type === "gradient"
                ? chatTheme?.downColor
                : chatTheme?.color
            }
          />
        ) : (
          <Like
            color={
              chatTheme?.type === "gradient"
                ? chatTheme?.downColor
                : chatTheme?.color
            }
          />
        )}
      </div>
    </div>
  );
}

export default SendMessage;
