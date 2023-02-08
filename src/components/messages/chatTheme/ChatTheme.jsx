import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { chatThemes } from "../../../data/chatThemes";
import { useChangeTheme } from "../../../hooks/useChangeTheme";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import Card from "../../UI/Card/Card";
import styles from "./ChatTheme.module.css";

function ChatTheme({ showChatTheme, setShowChatTheme, chatTheme, chat }) {
  const popUpRef = useRef();
  const [selectedTheme, setSelectedTheme] = useState(chatTheme);

  const nochange = selectedTheme === chatTheme;

  const { mutate: ChangeTheme, isSuccess: isChangeThemeSuccess } =
    useChangeTheme(chat);

  const changeThemeHandler = (theme) => {
    ChangeTheme({ chatId: chat._id, theme: theme.id });
  };

  useOnClickOutside(popUpRef, showChatTheme, () => {
    setShowChatTheme(false);
  });

  useEffect(() => {
    if (isChangeThemeSuccess) {
      setShowChatTheme(false);
    }
  }, [isChangeThemeSuccess]);

  return (
    <div className={`${styles.wrap} blur`}>
      <Card className={styles.card} innerRef={popUpRef}>
        <div className={styles.header}>
          <span>Themes</span>
          <div
            onClick={() => {
              setShowChatTheme(false);
            }}
            className={`${styles.exit} small_circle`}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
        <div className={styles.content}>
          <div className={`${styles.themes} `}>
            {chatThemes.map((theme) => (
              <div
                key={theme.id}
                className={`${styles.theme} hover2`}
                style={{
                  background: `${
                    theme === selectedTheme ? "var(--bg-third)" : ""
                  }`,
                }}
                onClick={() => {
                  setSelectedTheme(theme);
                }}
              >
                <div className={styles.theme_wrap}>
                  <div
                    className={styles.theme_con}
                    style={{
                      backgroundColor: theme.color,
                      backgroundImage: `${
                        theme.type === "gradient" ? theme.data : ""
                      }`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.btns}>
            <button
              className="gray_btn"
              onClick={() => {
                setShowChatTheme(false);
              }}
            >
              cancel
            </button>
            <button
              disabled={nochange}
              className="btn_blue"
              onClick={() => {
                changeThemeHandler(selectedTheme);
              }}
              style={{
                cursor: `${nochange ? "not-allowed" : "pointer"}`,
                background: `${
                  nochange ? "var(--bg-third)" : "var(--blue-color)"
                }`,
                color: `${nochange ? "#8a8a8a" : "#fff"}`,
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ChatTheme;
