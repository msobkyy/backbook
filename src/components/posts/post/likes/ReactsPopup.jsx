import { useRef } from "react";
import useOnClickOutside from "../../../../hooks/useOnClickOutside";
import styles from "./ReactsPopup.module.css";

const reactsArray = [
  {
    name: "like",
    image: "../../../reacts/like.gif",
  },
  {
    name: "love",
    image: "../../../reacts/love.gif",
  },
  {
    name: "haha",
    image: "../../../reacts/haha.gif",
  },
  {
    name: "wow",
    image: "../../../reacts/wow.gif",
  },
  {
    name: "sad",
    image: "../../../reacts/sad.gif",
  },
  {
    name: "angry",
    image: "../../../reacts/angry.gif",
  },
];

export default function ReactsPopup({
  handleMouseEnter,
  handleMouseLeave,
  reactHandler,
  setShowReact,
  showReact,
}) {
  const popUpRef = useRef();
  useOnClickOutside(popUpRef, showReact, () => {
    setShowReact(false);
  });
  return (
    <div
      ref={popUpRef}
      className={styles.popup}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {reactsArray.map((react, i) => (
        <div
          className={styles.react}
          key={i}
          onClick={() => reactHandler(react.name)}
        >
          <img src={react.image} alt={react.name} />
        </div>
      ))}
    </div>
  );
}
